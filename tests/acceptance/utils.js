import { OAuth2Client, OAuth2User, OAuth2Scope } from './../../src/mongoose';
import OAuth2Server, { Request, Response } from 'oauth2-server';
import { MongooseOAuth2 } from './../../src/model'

const oauth = new OAuth2Server({
  model: new MongooseOAuth2(),
  requireClientAuthentication: {
    password: false,
    refresh_token: false,
  },
});

const generateToken = async () => {
  // create a new client.
  const client = await OAuth2Client.create({
    name: 'the client',
    redirectUris: ['/'],
    grants: ['password', 'refresh_token']
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

  let tokenRequest = new Request({
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
      scope: 'basic admin',
    }
  });

  return await oauth.token(tokenRequest, new Response());
}

module.exports = { oauth, generateToken };
