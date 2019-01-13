import Mongoose, { Schema } from 'mongoose';

export const OAuth2TokenSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    accessTokenExpiresAt: {
      type: Date,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    refreshTokenExpiresAt: {
      type: Date,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'OAuth2User',
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'OAuth2Client',
      required: true,
    },
    scopes: [{
      type: String,
    }],
    revokedAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

export const OAuth2Token = Mongoose.model('OAuth2Token', OAuth2TokenSchema);
