import { HttpCode, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Identifier, Platform, PlatformWithIdentifiers } from './models';
import {
  SocialMediaIdentifier,
  SocialMediaIdentifierDocument,
} from './schemas/social-media-identifier.schema';
import {
  SocialMediaPlatform,
  SocialMediaPlatformDocument,
} from './schemas/social-media-platform.schema';
import { SocialMediaGateway } from './social-media.gateway';

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectModel(SocialMediaIdentifier.name)
    private identifierModel: Model<SocialMediaIdentifierDocument>,
    @InjectModel(SocialMediaPlatform.name)
    private platformModel: Model<SocialMediaPlatformDocument>,
    private readonly socialMediaGateway: SocialMediaGateway,
  ) {}

  async createPlatform(
    name: string,
    exampleIdentifier: string,
  ): Promise<PlatformWithIdentifiers> {
    try {
      const platform = new this.platformModel({
        name,
        exampleUrl: exampleIdentifier,
      });
      const savedPlatform = await platform.save();
      this.socialMediaGateway.sendPlatformUpdate(await this.getPlatforms());
      return {
        id: savedPlatform._id.toString(),
        name: savedPlatform.name,
        exampleIdentifier: savedPlatform.exampleUrl,
        identifiers: [],
      };
    } catch (error) {
      throw new HttpException('Platform not created', 400);
    }
  }

  async deletePlatform(id: string): Promise<Platform> {
    try {
      const platform = await this.platformModel.findById(id);
      if (!platform) {
        throw new HttpException('Platform not found', 404);
      }

      // Delete all identifiers associated with the platform
      await this.identifierModel.deleteMany({ platform: platform._id });

      const deletedPlatform = await this.platformModel
        .findByIdAndDelete(id)
        .exec();
      this.socialMediaGateway.sendPlatformUpdate(await this.getPlatforms());
      return {
        id: deletedPlatform._id.toString(),
        name: deletedPlatform.name,
        exampleIdentifier: deletedPlatform.exampleUrl,
      };
    } catch (error) {
      throw new HttpException('Platform not deleted', 400);
    }
  }

  async getPlatforms(): Promise<Platform[]> {
    const platforms = await this.platformModel.find().exec();
    return platforms.map((platform) => {
      return {
        id: platform._id.toString(),
        name: platform.name,
        exampleIdentifier: platform.exampleUrl,
      };
    });
  }

  async createIdentifier(
    platform: string,
    identifier: string,
  ): Promise<Identifier> {
    try {
      const socialMediaIdentifier = new this.identifierModel({
        platform,
        identifier,
      });
      const result = await socialMediaIdentifier.save();
      return {
        id: result._id.toString(),
        identifier: result.identifier,
      };
    } catch (error) {
      throw new HttpException('Identifier not created', 400);
    }
  }

  async getIdentifiers(): Promise<Identifier[]> {
    const result = await this.identifierModel
      .find()
      .populate('platform')
      .exec();
    return result.map((identifier) => {
      return {
        id: identifier._id.toString(),
        identifier: identifier.identifier,
      };
    });
  }

  async deleteIdentifier(id: string): Promise<Identifier> {
    try {
      const deletedIdentifier = await this.identifierModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedIdentifier) {
        throw new HttpException('Identifier not found', 404);
      }
      const result = deletedIdentifier;
      return {
        id: result._id.toString(),
        identifier: result.identifier,
      };
    } catch (error) {
      throw new HttpException('Identifier not deleted', 400);
    }
  }

  async getPlatformsAndIdentifiers(): Promise<PlatformWithIdentifiers[]> {
    const data = await this.platformModel
      .aggregate([
        {
          $lookup: {
            from: 'social_media_identifiers',
            localField: '_id',
            foreignField: 'platform',
            as: 'identifiers',
          },
        },
      ])
      .exec();
    const result = data.map((platform) => {
      return {
        id: platform._id,
        name: platform.name,
        exampleIdentifier: platform.exampleUrl,
        identifiers: platform.identifiers,
      };
    });
    return result;
  }

  @HttpCode(200)
  async verifyIdentifier(
    platform: string,
    identifier: string,
  ): Promise<{
    verified: boolean;
    platform: string;
    identifier: string;
  }> {
    const platformExists = await this.platformModel.exists({ name: platform });
    if (!platformExists) {
      throw new HttpException('Platform not found', 404);
    }
    const identifierExists = await this.identifierModel.exists({
      platform: platformExists._id,
      identifier,
    });
    if (!identifierExists) {
      throw new HttpException('Identifier not found', 404);
    }
    return {
      verified: true,
      platform,
      identifier,
    };
  }

  async updatePlatformName(id: string, newName: string): Promise<Platform> {
    try {
      const updatedPlatform = await this.platformModel
        .findByIdAndUpdate(id, { name: newName }, { new: true })
        .exec();
      if (!updatedPlatform) {
        throw new HttpException('Platform not found', 404);
      }
      this.socialMediaGateway.sendPlatformUpdate(await this.getPlatforms());
      return {
        id: updatedPlatform._id.toString(),
        name: updatedPlatform.name,
        exampleIdentifier: updatedPlatform.exampleUrl,
      };
    } catch (error) {
      throw new HttpException('Platform not updated', 400);
    }
  }

  async updatePlatformExample(
    id: string,
    newExample: string,
  ): Promise<Platform> {
    try {
      const updatedPlatform = await this.platformModel
        .findByIdAndUpdate(id, { exampleIdentifier: newExample }, { new: true })
        .exec();
      if (!updatedPlatform) {
        throw new HttpException('Platform not found', 404);
      }
      return {
        id: updatedPlatform._id.toString(),
        name: updatedPlatform.name,
        exampleIdentifier: updatedPlatform.exampleUrl,
      };
    } catch (error) {
      throw new HttpException('Platform example not updated', 400);
    }
  }

  async updatePlatformIdentifier(
    identifierId: string,
    newValue: string,
  ): Promise<Identifier> {
    try {
      const updatedIdentifier = await this.identifierModel
        .findByIdAndUpdate(
          identifierId,
          { identifier: newValue },
          { new: true },
        )
        .exec();
      if (!updatedIdentifier) {
        throw new HttpException('Identifier not found', 404);
      }
      return {
        id: updatedIdentifier._id.toString(),
        identifier: updatedIdentifier.identifier,
      };
    } catch (error) {
      throw new HttpException('Identifier not updated', 400);
    }
  }

  async addIdentifier(
    platformId: string,
    identifier: string,
  ): Promise<Identifier> {
    try {
      const newIdentifier = new this.identifierModel({
        platform: platformId,
        identifier,
      });
      const savedIdentifier = await newIdentifier.save();
      return {
        id: savedIdentifier._id.toString(),
        identifier: savedIdentifier.identifier,
      };
    } catch (error) {
      throw new HttpException('Identifier not added', 400);
    }
  }
}
