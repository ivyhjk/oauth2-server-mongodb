"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2Client = exports.OAuth2ClientSchema = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _csprng = _interopRequireDefault(require("csprng"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const OAuth2ClientSchema = new _mongoose.Schema({
  scopes: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'OAuth2Scope',
    default: []
  }],
  grants: [{
    type: String,
    default: []
  }],
  name: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    default: () => (0, _csprng.default)(256)
  },
  validateSecret: {
    type: Boolean,
    default: false
  },
  accessTokenLifetime: {
    type: Number,
    default: 3600
  },
  refreshTokenLifetime: {
    type: Number,
    default: 3600
  },
  redirectUris: {
    type: [String],
    required: true,
    validate: [{
      validator: redirecUris => redirecUris.length > 0,
      msg: 'please specify at least one redirect uri.'
    }]
  }
}, {
  timestamps: true
});
exports.OAuth2ClientSchema = OAuth2ClientSchema;

const OAuth2Client = _mongoose.default.model('OAuth2Client', OAuth2ClientSchema);

exports.OAuth2Client = OAuth2Client;