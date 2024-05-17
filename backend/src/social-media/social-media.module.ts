import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SocialMediaIdentifier,
  SocialMediaIdentifierSchema,
} from './schemas/social-media-identifier.schema';
import {
  SocialMediaPlatform,
  SocialMediaPlatformSchema,
} from './schemas/social-media-platform.schema';
import { SocialMediaController } from './social-media.controller';
import { SocialMediaGateway } from './social-media.gateway';
import { SocialMediaService } from './social-media.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocialMediaIdentifier.name, schema: SocialMediaIdentifierSchema },
      { name: SocialMediaPlatform.name, schema: SocialMediaPlatformSchema },
    ]),
  ],
  providers: [SocialMediaService, SocialMediaGateway, JwtService],
  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
