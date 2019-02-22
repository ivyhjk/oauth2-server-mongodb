import { expect } from 'chai';
import { ObjectID } from 'mongodb';
import { MongooseOAuth2 } from './../../src/model'
import {
  OAuth2Client,
  OAuth2Grant,
  OAuth2Group,
  OAuth2Scope,
  OAuth2Token,
  OAuth2User,
} from './../../src/mongoose';

describe('OAuth2 Mongoose model integration', () => {
  beforeEach(async () => {
    await OAuth2Client.deleteMany({});
    await OAuth2Grant.deleteMany({});
    await OAuth2Group.deleteMany({});
    await OAuth2Scope.deleteMany({});
    await OAuth2Token.deleteMany({});
    await OAuth2User.deleteMany({});
  });

  it('check constructor arguments', async () => {
    let Client = new OAuth2Client();
    let Grant = new OAuth2Grant();
    let Group = new OAuth2Group();
    let Scope = new OAuth2Scope();
    let Token = new OAuth2Token();
    let User = new OAuth2User();

    const model = new MongooseOAuth2({
      Client,
      Grant,
      Group,
      Scope,
      Token,
    });

    expect(model.Client).to.be.equal(Client);
    expect(model.Grant).to.be.equal(Grant);
    expect(model.Group).to.be.equal(Group);
    expect(model.Scope).to.be.equal(Scope);
    expect(model.Token).to.be.equal(Token);
    expect(model.User).to.be.not.equal(User);
  });

  it('check getAccessToken method when token does not exists', async () => {
    const model = new MongooseOAuth2();

    const token = await model.getAccessToken('foo');

    expect(token).to.be.null;
  });

  it('check getAccessToken method with an existent token', async () => {
    // The user.
    const user = await OAuth2User.create({
      name: 'the user',
      email: 'example@example.com',
      username: 'username',
      password: 'password',
    });

    // The client.
    const client = await OAuth2Client.create({
      name: 'the client',
      redirectUris: ['/'],
    });

    // The scopes.
    const firstScope = await OAuth2Scope.create({
      name: 'foo'
    });

    const secondScope = await OAuth2Scope.create({
      name: 'bar'
    });

    const accessTokenExpirationDate = new Date('2001-02-03 04:05:06');
    const refreshTokenExpirationDate = new Date('2002-03-04 05:06:07');

    // create a new token.
    const tokenModel = await OAuth2Token.create({
      accessToken: 'access token',
      accessTokenExpiresAt: accessTokenExpirationDate,
      refreshToken: 'refresh token',
      refreshTokenExpiresAt: refreshTokenExpirationDate,
      user: user,
      client: client,
      scopes: [
        firstScope._id,
        secondScope._id,
      ],
      revokedAt: null
    });

    const model = new MongooseOAuth2();

    const theToken = await model.getAccessToken('access token');

    expect(theToken.accessToken).to.be.equal('access token');
    expect(theToken.accessTokenExpiresAt.toTimeString()).to.be.equal(
      accessTokenExpirationDate.toTimeString()
    );
    expect(theToken.scope[0]).to.be.equal(firstScope._id.toString());
    expect(theToken.scope[1]).to.be.equal(secondScope._id.toString());
    expect(theToken.client.id).to.be.equal(tokenModel.client._id.toString());
    expect(theToken.user.id).to.be.equal(tokenModel.user._id.toString());
  });

  it('check getRefreshToken method when refresh token does not exists', async () => {
    const model = new MongooseOAuth2();

    const token = await model.getRefreshToken('foo');

    expect(token).to.be.null;
  });

  it('check getRefreshToken method with an existent refresh token', async () => {
    // The user.
    const user = await OAuth2User.create({
      name: 'the user',
      email: 'example@example.com',
      username: 'username',
      password: 'password',
    });

    // The client.
    const client = await OAuth2Client.create({
      name: 'the client',
      redirectUris: ['/'],
    });

    // The scopes.
    const firstScope = await OAuth2Scope.create({
      name: 'foo'
    });

    const secondScope = await OAuth2Scope.create({
      name: 'bar'
    });

    const accessTokenExpirationDate = new Date('2001-02-03 04:05:06');
    const refreshTokenExpirationDate = new Date('2002-03-04 05:06:07');

    // create a new token.
    const tokenModel = await OAuth2Token.create({
      accessToken: 'access token',
      accessTokenExpiresAt: accessTokenExpirationDate,
      refreshToken: 'refresh token',
      refreshTokenExpiresAt: refreshTokenExpirationDate,
      user: user,
      client: client,
      scopes: [
        firstScope._id,
        secondScope._id,
      ],
      revokedAt: null
    });

    const model = new MongooseOAuth2();

    const theToken = await model.getRefreshToken('refresh token');

    expect(theToken.refreshToken).to.be.equal('refresh token');
    expect(theToken.refreshTokenExpiresAt.toTimeString()).to.be.equal(
      refreshTokenExpirationDate.toTimeString()
    );
    expect(theToken.scope[0]).to.be.equal(firstScope._id.toString());
    expect(theToken.scope[1]).to.be.equal(secondScope._id.toString());
    expect(theToken.client.id).to.be.equal(tokenModel.client._id.toString());
    expect(theToken.user.id).to.be.equal(tokenModel.user._id.toString());
  });

  it('revoke the token', async () => {
    // The user.
    const user = await OAuth2User.create({
      name: 'the user',
      email: 'example@example.com',
      username: 'username',
      password: 'password',
    });

    // The client.
    const client = await OAuth2Client.create({
      name: 'the client',
      redirectUris: ['/'],
    });

    // The scopes.
    const firstScope = await OAuth2Scope.create({ name: 'foo' });

    // create the token.
    await OAuth2Token.create({
      accessToken: 'access token',
      accessTokenExpiresAt: new Date(),
      refreshToken: 'refresh token',
      refreshTokenExpiresAt: new Date(),
      user: user,
      client: client,
      scopes: [firstScope._id],
      revokedAt: null
    });

    const model = new MongooseOAuth2();

    const token = {
      refreshToken: 'refresh token',
    };

    const revoked = await model.revokeToken(token);

    expect(revoked).to.be.true;
  });

  it('get the client when client does not exists', async () => {
    const model = new MongooseOAuth2();

    const client = await model.getClient(new ObjectID(), 'the secret');

    expect(client).to.be.null;
  });

  it('get the client when client exists, but secret does not match', async () => {
    // Generate the client.
    const clientModel = await OAuth2Client.create({
      name: 'the client',
      secret: 'the secret',
      redirectUris: ['/'],
      validateSecret: true,
    });

    const model = new MongooseOAuth2();

    const client = await model.getClient(
      clientModel._id.toString(),
      'invalid secret',
    );

    expect(client).to.be.null;
  });

  it('get the client when client exists, and the secret match', async () => {
    // Generate the client.
    const clientModel = await OAuth2Client.create({
      name: 'the client',
      secret: 'the secret',
      redirectUris: ['/', '/dashboard'],
      validateSecret: true,
      grants: ['password']
    });

    const model = new MongooseOAuth2();

    const client = await model.getClient(
      clientModel._id.toString(),
      'the secret',
    );

    expect(client.id).to.be.equal(clientModel._id.toString());
    expect(client.redirectUris[0]).to.be.equal('/');
    expect(client.redirectUris[1]).to.be.equal('/dashboard');
    expect(client.grants[0]).to.be.equal('password');
    expect(client.accessTokenLifetime).to.be.null;
    expect(client.refreshTokenLifetime).to.be.null;
  });

  it(
    'get the client when client exists, and the secret does not match',
    async () => {
      // Generate the client.
      const clientModel = await OAuth2Client.create({
        name: 'the client',
        secret: 'the secret',
        redirectUris: ['/', '/dashboard'],
        validateSecret: true,
        grants: ['password']
      });

      const model = new MongooseOAuth2();

      const client = await model.getClient(
        clientModel._id.toString(),
        'invalid secret',
      );

      expect(client).to.be.null;
    }
  );

  it(
    'get the client when client exists, the secret does not match but is not validated',
    async () => {
      // Generate the client.
      const clientModel = await OAuth2Client.create({
        name: 'the client',
        secret: 'the secret',
        redirectUris: ['/', '/dashboard'],
        validateSecret: false,
        grants: ['password']
      });

      const model = new MongooseOAuth2();

      const client = await model.getClient(
        clientModel._id.toString(),
        'invalid secret',
      );

      expect(client.id).to.be.equal(clientModel._id.toString());
      expect(client.redirectUris[0]).to.be.equal('/');
      expect(client.redirectUris[1]).to.be.equal('/dashboard');
      expect(client.grants[0]).to.be.equal('password');
    }
  );

  it('get the user when given username does not exists', async () => {
    const model = new MongooseOAuth2();

    const user = await model.getUser('the username', 'the password');

    expect(user).to.be.null;
  });

  it(
    'get the user when given username exists but the user is not active',
    async () => {
      await OAuth2User.create({
        name: 'the user',
        email: 'example@example.com',
        username: 'the username',
        password: 'the password',
        active: false,
      });

      const model = new MongooseOAuth2();

      const user = await model.getUser('the username', 'the password');

      expect(user).to.be.null;
    }
  );

  it(
    'get the user when given username exists, is active, but the password does not match',
    async () => {
      await OAuth2User.create({
        name: 'the user',
        email: 'example@example.com',
        username: 'the username',
        password: 'the password',
        active: true,
      });

      const model = new MongooseOAuth2();

      const user = await model.getUser('the username', 'invalid password');

      expect(user).to.be.null;
    }
  );

  it(
    'get the user when given username exists, is active and password match',
    async () => {
      const firstGroup = await OAuth2Group.create({
        name: 'foo',
        scopes: ['basic', 'sudo'],
      });

      const secondGroup = await OAuth2Group.create({
        name: 'bar',
        scopes: ['edit'],
      });

      const userModel = await OAuth2User.create({
        name: 'the user',
        email: 'example@example.com',
        username: 'the username',
        password: 'the password',
        active: true,
        groups: [firstGroup, secondGroup]
      });

      const model = new MongooseOAuth2();

      const user = await model.getUser('the username', 'the password');

      expect(user.id.toString()).to.be.equal(userModel._id.toString());
      expect(user.groups[0]._id.toString()).to.be.equal(firstGroup._id.toString());
      expect(user.groups[0].scopes[0]).to.be.equal(firstGroup.scopes[0]);
      expect(user.groups[0].scopes[1]).to.be.equal(firstGroup.scopes[1]);
      expect(user.groups[1]._id.toString()).to.be.equal(secondGroup._id.toString());
      expect(user.groups[1].scopes[0]).to.be.equal(secondGroup.scopes[0]);
    }
  );

  it('save token', async () => {
    // The client.
    const clientModel = await OAuth2Client.create({
      name: 'the client',
      redirectUris: ['/'],
    });

    // The user.
    const userModel = await OAuth2User.create({
      name: 'the user',
      email: 'example@example.com',
      username: 'username',
      password: 'password',
    });

    const model = new MongooseOAuth2();

    const accessTokenExpiresAt = new Date('2001-02-03 04:05:06');
    const refreshTokenExpiresAt = new Date('2002-03-04 05:06:07');

    const token = {
      accessToken: 'access token',
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshToken: 'refresh token',
      refreshTokenExpiresAt: refreshTokenExpiresAt,
      scope: ['basic', 'admin'],
    };

    const client = {
      id: clientModel._id.toString(),
    };

    const user = {
      id: userModel._id.toString(),
    };

    const savedToken = await model.saveToken(token, client, user);

    expect(savedToken.accessToken).to.be.equal('access token');
    expect(savedToken.accessTokenExpiresAt).to.be.equal(accessTokenExpiresAt);
    expect(savedToken.refreshToken).to.be.equal('refresh token');
    expect(savedToken.refreshTokenExpiresAt).to.be.equal(refreshTokenExpiresAt);
    expect(savedToken.scope).to.be.equal('basic admin');
    expect(savedToken.client.id.toString()).to.be.equal(client.id.toString());
    expect(savedToken.user.id).to.be.equal(user.id.toString());
  });

  it('should return nullable scope, because scopes are empty', async () => {
    const user = {};
    const client = {};
    const scopes = '';

    const model = new MongooseOAuth2();

    const validatedScopes = await model.validateScope(user, client, scopes);

    expect(validatedScopes).to.be.false;
  });

  it('should return validated scopes', async () => {
    const firstGroup = await OAuth2Group.create({
      name: 'first group',
      scopes: 'basic'
    });

    const secondGroup = await OAuth2Group.create({
      name: 'second group',
      scopes: 'edit'
    });

    const userModel = await OAuth2User.create({
      name: 'the user',
      email: 'example@example.com',
      username: 'username',
      password: 'password',
      groups: [firstGroup, secondGroup],
    });

    // a database scope.
    await OAuth2Scope.create({
      name: 'admin'
    });

    const user = {
      id: userModel._id,
      groups: userModel.groups,
    };

    // for now client is not used.
    const client = {};

    // "basic" exists in groups.
    // "admin" exists in database.
    const scopes = [
      'basic',
      'admin',
      'invalid',
      'another invalid',
    ].join(' ');

    const model = new MongooseOAuth2();

    const validatedScopes = await model.validateScope(user, client, scopes);

    expect(validatedScopes).to.have.lengthOf(2);
    expect(validatedScopes[0]).to.be.equal('basic');
    expect(validatedScopes[1]).to.be.equal('admin');
  });
});
