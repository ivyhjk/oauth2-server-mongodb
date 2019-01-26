import Argon2 from 'argon2';
import {
  OAuth2Client,
  OAuth2Grant,
  OAuth2Group,
  OAuth2Scope,
  OAuth2Token,
  OAuth2User,
} from './mongoose';

export class MongooseOAuth2 {
  constructor(
    { Client, Grant, Group, Scope, Token, User } = {
      Client: OAuth2Client,
      Grant: OAuth2Grant,
      Group: OAuth2Group,
      Scope: OAuth2Scope,
      Token: OAuth2Token,
      User: OAuth2User,
    }
  ) {
    this.Client = Client;
    this.Grant = Grant;
    this.Group = Group;
    this.Scope = Scope;
    this.Token = Token;
    this.User = User;
  }

  async getAccessToken(accessToken) {
    let token = await this.Token
      .findOne({
        accessToken,
        // maybe?
        revokedAt: null,
      })
      .select({
        accessToken: 1,
        accessTokenExpiresAt: 1,
        scopes: 1,
        client: 1,
        user: 1,
      });

    if (!token) {
      return null;
    }

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      scope: token.scopes,
      client: {
        id: token.client._id.toString(),
      },
      user: {
        id: token.user._id.toString(),
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
    let token = await this.Token
      .findOne({
        refreshToken,
        revokedAt: null,
      })
      .select({
        refreshToken: 1,
        refreshTokenExpiresAt: 1,
        scopes: 1,
        client: 1,
        user: 1,
      });

    if (!token) {
      return null;
    }

    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scopes,
      client: {
        id: token.client._id.toString(),
      },
      user: {
        id: token.user._id.toString(),
      }
    };
  }

  async revokeToken(token) {
    let response = await this.Token.updateOne(
      {
        refreshToken: token.refreshToken,
        revokedAt: null
      },
      {
        $set: {
          revokedAt: new Date()
        }
      }
    );

    return response.ok === 1 && response.nModified !== 0;
  }

  async getClient(clientId, clientSecret) {
    let client = await this.Client
      .findOne({
        _id: clientId,
      })
      .select({
        _id: 1,
        secret: 1,
        redirectUris: 1,
        grants: 1,
        validateSecret: 1,
        accessTokenLifetime: 1,
        refreshTokenLifetime: 1,
      });

    if (!client || (client.validateSecret && client.secret !== clientSecret)) {
      return null;
    }

    return {
      id: client._id.toString(),
      redirectUris: client.redirectUris,
      grants: client.grants,
      accessTokenLifetime: client.accessTokenLifetime,
      refreshTokenLifetime: client.refreshTokenLifetime,
      // maybe additional data??
    };
  }

  async getUser(username, password) {
    let user = await this.User
      .findOne({
        username,
        active: true,
      })
      .select({
        _id: 1,
        username: 1,
        password: 1,
        groups: 1,
      })
      .populate('groups');

    if (!user || !(await Argon2.verify(user.password, password))) {
      return null;
    }

    return {
      id: user._id,
      groups: user.groups,
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
        id: repository.client.toString(),
      },
      user: {
        id: repository.user.toString(),
      },
    };
  }

  async validateScope(user, _client, scope) {
    if (typeof scope === 'undefined' || ! scope) {
      return false;
    }

    const scopes = scope.split(' ');

    let databaseScopes = (await this.Scope
      .find({
        name: scopes
      })
      .select({
        name: 1,
      }))
      .map((scope) => scope.name);

    const validatedScopes = scopes
      .filter((scope) => {
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
