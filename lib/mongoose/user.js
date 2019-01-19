"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2User = exports.OAuth2UserSchema = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _plugin = require("./plugin");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const OAuth2UserSchema = new _mongoose.Schema({
  groups: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'OAuth2Group'
  }],
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
exports.OAuth2UserSchema = OAuth2UserSchema;
OAuth2UserSchema.plugin(_plugin.passwordHasher);

const OAuth2User = _mongoose.default.model('OAuth2User', OAuth2UserSchema);

exports.OAuth2User = OAuth2User;