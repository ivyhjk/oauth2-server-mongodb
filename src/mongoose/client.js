import Mongoose, { Schema } from 'mongoose';
import csprng from 'csprng';

export const OAuth2ClientSchema = new Schema(
  {
    scopes: [{
      type: Schema.Types.ObjectId,
      ref: 'OAuth2Scope',
      default: [],
    }],
    grants: [{
      type: String,
      default: []
    }],
    name: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      default: () => csprng(256)
    },
    redirectUris: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (redirecUris) => redirecUris.length > 0,
          msg: 'please specify at least one redirect uri.'
        }
      ]
    },
  },
  {
    timestamps: true,
  }
);

export const OAuth2Client = Mongoose.model('OAuth2Client', OAuth2ClientSchema);
