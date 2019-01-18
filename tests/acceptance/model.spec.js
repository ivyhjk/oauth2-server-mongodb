import { expect } from 'chai';
import OAuth2Server, { Request, Response } from 'oauth2-server';
import { MongooseOAuth2 } from './../../src/model'
import { OAuth2Token, OAuth2Client, OAuth2User, OAuth2Scope } from './../../src/mongoose';

describe('OAuth2 Mongoose model acceptance', () => {
  beforeEach(async () => {
    await OAuth2Token.deleteMany({});
    await OAuth2Client.deleteMany({});
    await OAuth2User.deleteMany({});
    await OAuth2Scope.deleteMany({});
  });

  it('try to authenticate but the access token is not valid', async () => {
    const oauth = new OAuth2Server({
      model: new MongooseOAuth2()
    });

    let request = new Request({
      method: 'GET',
      query: {},
      headers: {
        Authorization: 'Bearer invalidToken'
      }
    });

    let response = new Response();

    let authentication = null;

    try {
      authentication = await oauth.authenticate(request, response);
    } catch (e) {
      expect(e.name).to.be.equal('invalid_token');
    }

    expect(authentication).to.be.null;
  });

  it('try to generate a new token with a GET request', async () => {
    const oauth = new OAuth2Server({
      model: new MongooseOAuth2()
    });

    let request = new Request({
      method: 'GET',
      headers: {},
      query: {},
    });

    let response = new Response();

    let token = null;

    try {
      token = await oauth.token(request, response);
    } catch (e) {
      expect(e.name).to.be.equal('invalid_request');
    }

    expect(token).to.be.null;
  });

  it('validate a simple token', async () => {
    // create a new client.
    const client = await OAuth2Client.create({
      name: 'the client',
      redirectUris: ['/'],
      grants: ['password']
    });

    // create a new user.
    await OAuth2User.create({
      name: 'a user',
      email: 'example@example.com',
      username: 'the username',
      password: 'the password',
    });

    // create some scopes.
    await OAuth2Scope.insertMany([
      { name: 'basic' },
      { name: 'admin' },
      { name: 'edit' },
    ]);

    // generate the OAuth2 server.
    const oauth = new OAuth2Server({
      model: new MongooseOAuth2(),
      requireClientAuthentication: {
        password: false,
      },
    });

    let request = new Request({
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "content-length": 1,
      },
      query: {},
      body: {
        client_id: client._id.toString(),
        grant_type: 'password',
        username: 'the username',
        password: 'the password',
        scope: 'basic,admin',
      }
    });

    let response = new Response();

    let token = null;

    try {
      token = await oauth.token(request, response);
    } catch (e) {

    }

    expect(token).to.not.be.null;
    expect(token.accessToken).to.exist;
    expect(token.accessTokenExpiresAt).to.exist;
    expect(token.refreshToken).to.exist;
    expect(token.refreshTokenExpiresAt).to.exist;
    expect(token.scope).to.exist;
    expect(token.client).to.exist;
    expect(token.user).to.exist;
  });
});
