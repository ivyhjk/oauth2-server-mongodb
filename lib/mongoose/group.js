"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2Group = exports.OAuth2GroupSchema = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const OAuth2GroupSchema = new _mongoose.Schema({
  scopes: [{
    type: String
  }],
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
exports.OAuth2GroupSchema = OAuth2GroupSchema;

const OAuth2Group = _mongoose.default.model('OAuth2Group', OAuth2GroupSchema);

exports.OAuth2Group = OAuth2Group;