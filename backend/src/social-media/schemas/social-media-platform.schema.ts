import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SocialMediaPlatformDocument = HydratedDocument<SocialMediaPlatform>;

@Schema({
  timestamps: true,
  collection: 'social_media_platforms',
})
export class SocialMediaPlatform {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  exampleUrl: string;
}

export const SocialMediaPlatformSchema =
  SchemaFactory.createForClass(SocialMediaPlatform);
