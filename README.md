# OAuth2 server MongoDB models

The goal of this bundle is provide a full implementation of
[oauth2-server](https://github.com/oauthjs/node-oauth2-server) model made with
MongoDB and Mongoose.

## Installation instructions

With Yarn:
```
yarn add oauth2-server-mongoose-models
```

With NPM:
```
npm install --save oauth2-server-mongoose-models
```

## Usage

Simple usage:
```javascript
import { MongooseOAuth2 } from 'oauth2-server-mongoose-models';

const model = new MongooseOAuth2();

// use your model in any oauth2-server implementation
// ...
```

Also you can use your custom models:
```javascript
import { MongooseOAuth2 } from 'oauth2-server-mongoose-models';
import { User, Token } from './custom-models';

const model = new MongooseOAuth2({ User, Token });

// use your model in any oauth2-server implementation
// ...
```

## Running tests

To run tests we suggest to use the pre-defined MongoDB image with docker-compose:
```
docker-compose up -d
```

And then:
```
yarn tests
```

Alternatively you can create the following environment variables:

| Name                | Default                     |
| :------------------ | :-------------------------- |
| MONGODB_USERNAME    | dummy                       |
| MONGODB_PASSWORD    | dummy                       |
| MONGODB_HOST        | 127.0.0.1                   |
| MONGODB_PORT        | 27017                       |
| MONGODB_DATABASE    | oauth2_server_mongodb_tests |
| MONGODB_AUTH_SOURCE | dummy                       |

And then:
```
yarn tests
```

Also you can edit directly the `tests/database-setup.js` file and use
your own DSN.
