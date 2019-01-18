import Mongoose, { Schema } from 'mongoose';

export const OAuth2GroupSchema = new Schema(
  {
    scopes: [{
      type: String,
    }],
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const OAuth2Group = Mongoose.model('OAuth2Group', OAuth2GroupSchema);
