"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2Token = exports.OAuth2TokenSchema = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const OAuth2TokenSchema = new _mongoose.Schema({
  accessToken: {
    type: String,
    required: true
  },
  accessTokenExpiresAt: {
    type: Date,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  refreshTokenExpiresAt: {
    type: Date,
    required: true
  },
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'OAuth2User',
    required: true
  },
  client: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'OAuth2Client',
    required: true
  },
  scopes: [{
    type: String
  }],
  revokedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});
exports.OAuth2TokenSchema = OAuth2TokenSchema;

const OAuth2Token = _mongoose.default.model('OAuth2Token', OAuth2TokenSchema);

exports.OAuth2Token = OAuth2Token;