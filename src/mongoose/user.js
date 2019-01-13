import Mongoose, { Schema } from 'mongoose';
import { passwordHasher } from './plugin';

export const OAuth2UserSchema = new Schema(
  {
    groups: [{
      type: Schema.Types.ObjectId,
      ref: 'OAuth2Group',
    }],
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

OAuth2UserSchema.plugin(passwordHasher);

export const OAuth2User = Mongoose.model('OAuth2User', OAuth2UserSchema);
