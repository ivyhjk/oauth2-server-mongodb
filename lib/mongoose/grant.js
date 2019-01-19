"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2Grant = exports.OAuth2GrantSchema = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const OAuth2GrantSchema = new _mongoose.Schema({
  scopes: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'OAuth2Scope'
  }],
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
exports.OAuth2GrantSchema = OAuth2GrantSchema;

const OAuth2Grant = _mongoose.default.model('OAuth2Grant', OAuth2GrantSchema);

exports.OAuth2Grant = OAuth2Grant;