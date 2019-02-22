"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MongooseOAuth2 = void 0;

var _argon = _interopRequireDefault(require("argon2"));

var _mongoose = require("./mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const defaults = [['Client', _mongoose.OAuth2Client], ['Grant', _mongoose.OAuth2Grant], ['Group', _mongoose.OAuth2Group], ['Scope', _mongoose.OAuth2Scope], ['Token', _mongoose.OAuth2Token], ['User', _mongoose.OAuth2User]];

class MongooseOAuth2 {
  constructor() {
    let models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    for (const _ref of defaults) {
      var _ref2 = _slicedToArray(_ref, 2);

      const key = _ref2[0];
      const value = _ref2[1];

      if (typeof models[key] === 'undefined') {
        this[key] = value;
      } else {
        this[key] = models[key];
      }
    }
  }

  async getAccessToken(accessToken) {
    let token = await this.Token.findOne({
      accessToken,
      // maybe?
      revokedAt: null
    }).select({
      accessToken: 1,
      accessTokenExpiresAt: 1,
      scopes: 1,
      client: 1,
      user: 1
    });

    if (!token) {
      return null;
    }

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      scope: token.scopes,
      client: {
        id: token.client._id.toString()
      },
      user: {
        id: token.user._id.toString()
      }
    };
  }

  async verifyScope(accessToken, scopes) {
    for (const scope of scopes) {
      if (accessToken.scope.includes(scope)) {
        return true;
      }
    }

    return false;
  }

  async getRefreshToken(refreshToken) {
    let token = await this.Token.findOne({
      refreshToken,
      revokedAt: null
    }).select({
      refreshToken: 1,
      refreshTokenExpiresAt: 1,
      scopes: 1,
      client: 1,
      user: 1
    });

    if (!token) {
      return null;
    }

    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scopes,
      client: {
        id: token.client._id.toString()
      },
      user: {
        id: token.user._id.toString()
      }
    };
  }

  async revokeToken(token) {
    let response = await this.Token.updateOne({
      refreshToken: token.refreshToken,
      revokedAt: null
    }, {
      $set: {
        revokedAt: new Date()
      }
    });
    return response.ok === 1 && response.nModified !== 0;
  }

  async getClient(clientId, clientSecret) {
    let client = await this.Client.findOne({
      _id: clientId
    }).select({
      _id: 1,
      secret: 1,
      redirectUris: 1,
      grants: 1,
      validateSecret: 1,
      accessTokenLifetime: 1,
      refreshTokenLifetime: 1
    });

    if (!client || client.validateSecret && client.secret !== clientSecret) {
      return null;
    }

    return {
      id: client._id.toString(),
      redirectUris: client.redirectUris,
      grants: client.grants,
      accessTokenLifetime: client.accessTokenLifetime,
      refreshTokenLifetime: client.refreshTokenLifetime // maybe additional data??

    };
  }

  async getUser(username, password) {
    let user = await this.User.findOne({
      username,
      active: true
    }).select({
      _id: 1,
      username: 1,
      password: 1,
      groups: 1
    }).populate('groups');

    if (!user || !(await _argon.default.verify(user.password, password))) {
      return null;
    }

    return {
      id: user._id,
      groups: user.groups
    };
  }

  async saveToken(token, client, user) {
    let repository = await this.Token.create({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      user: user.id,
      client: client.id,
      scopes: token.scope
    });
    return {
      accessToken: repository.accessToken,
      accessTokenExpiresAt: repository.accessTokenExpiresAt,
      refreshToken: repository.refreshToken,
      refreshTokenExpiresAt: repository.refreshTokenExpiresAt,
      scope: repository.scopes.join(' '),
      client: {
        id: repository.client.toString()
      },
      user: {
        id: repository.user.toString()
      }
    };
  }

  async validateScope(user, _client, scope) {
    if (typeof scope === 'undefined' || !scope) {
      return false;
    }

    const scopes = scope.split(' ');
    let databaseScopes = (await this.Scope.find({
      name: scopes
    }).select({
      name: 1
    })).map(scope => scope.name);
    const validatedScopes = scopes.filter(scope => {
      if (databaseScopes.includes(scope)) {
        return true;
      }

      for (const group of user.groups) {
        if (group.scopes.includes(scope)) {
          return true;
        }
      }

      return false;
    });
    return validatedScopes;
  }

}

exports.MongooseOAuth2 = MongooseOAuth2;