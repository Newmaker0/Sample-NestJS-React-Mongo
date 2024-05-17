import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { SocialMediaPlatform } from './social-media-platform.schema';

export type SocialMediaIdentifierDocument =
  HydratedDocument<SocialMediaIdentifier>;

@Schema({
  timestamps: true,
  collection: 'social_media_identifiers',
})
export class SocialMediaIdentifier {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'SocialMediaPlatform',
    required: true,
  })
  platform: SocialMediaPlatform;

  @Prop({ required: true })
  identifier: string;
}

export const SocialMediaIdentifierSchema = SchemaFactory.createForClass(
  SocialMediaIdentifier,
);
