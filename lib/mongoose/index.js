"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require("./client");

Object.keys(_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _client[key];
    }
  });
});

var _group = require("./group");

Object.keys(_group).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _group[key];
    }
  });
});

var _grant = require("./grant");

Object.keys(_grant).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _grant[key];
    }
  });
});

var _scope = require("./scope");

Object.keys(_scope).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _scope[key];
    }
  });
});

var _token = require("./token");

Object.keys(_token).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _token[key];
    }
  });
});

var _user = require("./user");

Object.keys(_user).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _user[key];
    }
  });
});