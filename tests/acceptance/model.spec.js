import { expect } from 'chai';
import { Request, Response } from 'oauth2-server';
import { OAuth2Token, OAuth2Client, OAuth2User, OAuth2Scope } from './../../src/mongoose';
import { generateToken, oauth } from './utils';

describe('OAuth2 Mongoose model acceptance', () => {
  beforeEach(async () => {
    await OAuth2Token.deleteMany({});
    await OAuth2Client.deleteMany({});
    await OAuth2User.deleteMany({});
    await OAuth2Scope.deleteMany({});
  });

  it('try to generate a new token with a GET request', async () => {
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

  it('validate a simple token generation', async () => {
    let token = await generateToken();

    expect(token.accessToken).to.exist;
    expect(token.accessTokenExpiresAt).to.exist;
    expect(token.refreshToken).to.exist;
    expect(token.refreshTokenExpiresAt).to.exist;
    expect(token.scope).to.exist;
    expect(token.client).to.exist;
    expect(token.user).to.exist;
  });

  it('try to refresh a simple token', async () => {
    // at first, generate the token.
    let token = await generateToken();

    // then, try to refresh the token.
    let refreshTokenRequest = new Request({
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "content-length": 1,
      },
      query: {

      },
      body: {
        client_id: token.client.id,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }
    });

    let refreshedToken = await oauth.token(
      refreshTokenRequest,
      new Response(),
    );

    expect(refreshedToken.accessToken).to.exist;
    expect(refreshedToken.accessTokenExpiresAt).to.exist;
    expect(refreshedToken.refreshToken).to.exist;
    expect(refreshedToken.refreshTokenExpiresAt).to.exist;
    expect(refreshedToken.scope).to.exist;
    expect(refreshedToken.client).to.exist;
    expect(refreshedToken.user).to.exist;
  });

  it('try to authenticate but the access token is not valid', async () => {
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

  it('authenticate the request', async () => {
    const token = await generateToken();

    let authenticateRequest = new Request({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      },
      query: {},
    });

    // expect no failure.
    await oauth.authenticate(authenticateRequest, new Response());
  });

  it('authenticate the request with the given scopes', async () => {
    const token = await generateToken();

    let authenticateRequest = new Request({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      },
      query: {},
    });

    // expect no failure.
    await oauth.authenticate(
      authenticateRequest,
      new Response(),
      { scope: ['admin', 'basic'] }
    );
  });

  it('authenticate the request with the given scopes', async () => {
    const token = await generateToken();

    let authenticateRequest = new Request({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      },
      query: {},
    });

    let authenticatedToken = null;

    try {
      authenticatedToken = await oauth.authenticate(
        authenticateRequest,
        new Response(),
        { scope: ['unbound scope'] }
      );
    } catch (e) {
      expect(e.name).to.be.equal('insufficient_scope');
    }

    expect(authenticatedToken).to.be.null;
  });
});
