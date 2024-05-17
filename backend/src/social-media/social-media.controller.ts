import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { Identifier, Platform, PlatformWithIdentifiers } from './models';
import { SocialMediaService } from './social-media.service';

@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Post('platform')
  @UseGuards(AuthGuard)
  async createPlatform(
    @Body('name') name: string,
    @Body('exampleIdentifier') exampleIdentifier: string,
  ): Promise<PlatformWithIdentifiers> {
    return this.socialMediaService.createPlatform(name, exampleIdentifier);
  }

  @Get('platform')
  async getPlatforms(): Promise<Platform[]> {
    return this.socialMediaService.getPlatforms();
  }

  @Delete('platform/:id')
  @UseGuards(AuthGuard)
  async deletePlatform(@Param('id') id: string): Promise<Platform> {
    return this.socialMediaService.deletePlatform(id);
  }

  @Patch('platform/:id')
  @UseGuards(AuthGuard)
  async updatePlatformName(
    @Param('id') id: string,
    @Body('newName') newName: string,
  ): Promise<Platform> {
    return this.socialMediaService.updatePlatformName(id, newName);
  }

  @Patch('platform/:id/example')
  @UseGuards(AuthGuard)
  async updatePlatformExample(
    @Param('id') id: string,
    @Body('newExample') newExample: string,
  ): Promise<Platform> {
    return this.socialMediaService.updatePlatformExample(id, newExample);
  }

  @Get('platforms-with-identifiers')
  @UseGuards(AuthGuard)
  async getPlatformsAndIdentifiers(): Promise<PlatformWithIdentifiers[]> {
    return this.socialMediaService.getPlatformsAndIdentifiers();
  }

  @Post('verify')
  async verifyIdentifier(
    @Body('platform') platform: string,
    @Body('identifier') identifier: string,
  ): Promise<{
    verified: boolean;
    platform: string;
    identifier: string;
  }> {
    return this.socialMediaService.verifyIdentifier(platform, identifier);
  }

  @Post('identifier')
  @UseGuards(AuthGuard)
  async createIdentifier(
    @Body('platform') platform: string,
    @Body('identifier') identifier: string,
  ): Promise<Identifier> {
    return this.socialMediaService.createIdentifier(platform, identifier);
  }

  @Get('identifier')
  @UseGuards(AuthGuard)
  async getIdentifiers(): Promise<Identifier[]> {
    return this.socialMediaService.getIdentifiers();
  }

  @Delete('identifier/:id')
  @UseGuards(AuthGuard)
  async deleteIdentifier(@Param('id') id: string): Promise<Identifier> {
    return this.socialMediaService.deleteIdentifier(id);
  }

  @Patch('identifier/:identifierId')
  @UseGuards(AuthGuard)
  async updatePlatformIdentifier(
    @Param('identifierId') identifierId: string,
    @Body('newValue') newValue: string,
  ): Promise<Identifier> {
    return this.socialMediaService.updatePlatformIdentifier(
      identifierId,
      newValue,
    );
  }

  @Post('platform/:platformId/identifier')
  @UseGuards(AuthGuard)
  async addIdentifier(
    @Param('platformId') platformId: string,
    @Body('identifier') identifier: string,
  ): Promise<Identifier> {
    return this.socialMediaService.addIdentifier(platformId, identifier);
  }
}
