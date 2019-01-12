# OAuth2 server MongoDB

The goal of this bundle is provide a full implementation of
[oauth2-server](https://github.com/oauthjs/node-oauth2-server) model made with
MongoDB and Mongoose.

## Installation instructions

With Yarn:
```
yarn add oauth2-server-mongodb
```

With NPM:
```
npm install --save oauth2-server-mongodb
```

## Usage

Simple usage:
```javascript
import { MongooseOAuth2 } from 'oauth2-server-mongodb';

const model = new MongooseOAuth2();

// use your model in any oauth2-server implementation
// ...
```

Also you can use your custom models:
```javascript
import { MongooseOAuth2 } from 'oauth2-server-mongodb';
import { User, Token } from './custom-models';

const model = new MongooseOAuth2({ User, Token });

// use your model in any oauth2-server implementation
// ...
```
