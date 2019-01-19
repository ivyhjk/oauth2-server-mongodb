"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2Scope = exports.OAuth2ScopeSchema = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const OAuth2ScopeSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
exports.OAuth2ScopeSchema = OAuth2ScopeSchema;

const OAuth2Scope = _mongoose.default.model('OAuth2Scope', OAuth2ScopeSchema);

exports.OAuth2Scope = OAuth2Scope;