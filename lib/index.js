"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = require("./model");

Object.keys(_model).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _model[key];
    }
  });
});

var _mongoose = require("./mongoose");

Object.keys(_mongoose).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mongoose[key];
    }
  });
});