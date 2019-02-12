"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _argon = _interopRequireDefault(require("argon2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(schema) {
  const passwordHasher = async function passwordHasher(next) {
    if (typeof this._update !== 'undefined') {
      if (typeof this._update.password !== 'undefined' && this._update.password) {
        this._update.password = await _argon.default.hash(this._update.password);
      } else if (typeof this._update['$set'] !== 'undefined' && this._update['$set'].password) {
        this._update['$set'].password = await _argon.default.hash(this._update['$set'].password);
      }
    } else if (typeof this.password !== 'undefined' && this.password) {
      this.password = await _argon.default.hash(this.password);
    }

    next();
  };

  schema.pre('findOneAndUpdate', passwordHasher);
  schema.pre('updateOne', passwordHasher);
  schema.pre('save', passwordHasher);
}