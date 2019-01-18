import { expect } from 'chai';
import {
  OAuth2Token,
  OAuth2User,
  OAuth2Client,
} from './../../../src/mongoose';

describe('Token model', () => {
  beforeEach(async () => {
    await OAuth2Token.deleteMany({});
  });

  it('create a new token', async () => {
    const expirationDate = new Date();
    const refreshTokenExpirationDate = new Date();

    const user = await OAuth2User.create({
      name: 'A user',
      email: 'example@example.com',
      password: 'password',
      username: 'username',
    });

    const client = await OAuth2Client.create({
      name: 'A client',
      redirectUris: ['/']
    });

    await OAuth2Token.create({
      accessToken: 'an access token',
      accessTokenExpiresAt: expirationDate,
      refreshToken: 'a refresh token',
      refreshTokenExpiresAt: refreshTokenExpirationDate,
      user: user._id,
      client: client._id,
      scopes: ['foo', 'bar'],
    });

    let token = await OAuth2Token.findOne({accessToken: 'an access token'})
      .populate('user')
      .populate('client');

    expect(token).to.not.be.null;
    expect(token.accessToken).to.equal('an access token');
    expect(token.accessTokenExpiresAt.toTimeString()).to.equal(
      expirationDate.toTimeString()
    );
    expect(token.refreshToken).to.equal('a refresh token');
    expect(token.refreshTokenExpiresAt.toTimeString()).to.equal(
      refreshTokenExpirationDate.toTimeString()
    );
    expect(token.user.name).to.equal('A user');
    expect(token.client.name).to.equal('A client');
    expect(token.scopes[0]).to.equal('foo');
    expect(token.scopes[1]).to.equal('bar');
  });

  it('check timestamps', async () => {
    const expirationDate = new Date();
    const refreshTokenExpirationDate = new Date();

    const user = await OAuth2User.create({
      name: 'A user',
      email: 'example@example.com',
      password: 'password',
      username: 'username',
    });

    const client = await OAuth2Client.create({
      name: 'A client',
      redirectUris: ['/']
    });

    let token = await OAuth2Token.create({
      accessToken: 'an access token',
      accessTokenExpiresAt: expirationDate,
      refreshToken: 'a refresh token',
      refreshTokenExpiresAt: refreshTokenExpirationDate,
      user: user._id,
      client: client._id,
      scopes: ['foo', 'bar'],
    });

    let updated = await OAuth2Token.findOneAndUpdate(
      {
        accessToken: 'an access token',
      },
      {
        $set: {
          revokedAt: new Date(),
        }
      }
    );

    expect(token.createdAt).to.exist;
    expect(token.updatedAt).to.exist;
    expect(token.createdAt.toTimeString()).to.be.equal(
      updated.createdAt.toTimeString()
    );
    expect(token.updatedAt).to.not.be.below(updated.updatedAt);
  });
});
