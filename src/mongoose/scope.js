import Mongoose, { Schema } from 'mongoose';

export const OAuth2ScopeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

export const OAuth2Scope = Mongoose.model('OAuth2Scope', OAuth2ScopeSchema);
