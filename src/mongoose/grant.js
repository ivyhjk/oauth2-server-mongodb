import Mongoose, { Schema } from 'mongoose';

export const OAuth2GrantSchema = new Schema(
  {
    scopes: [{
      type: Schema.Types.ObjectId,
      ref: 'OAuth2Scope',
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

export const OAuth2Grant = Mongoose.model('OAuth2Grant', OAuth2GrantSchema);
