import mongoose from 'mongoose';

(async () => {
  try {
    const MONGODB_USERNAME = process.env.MONGODB_USERNAME || 'dummy';
    const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'dummy';
    const MONGODB_HOST = process.env.MONGODB_HOST || '127.0.0.1';
    const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
    const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'oauth2_server_mongodb_tests';
    const MONGODB_AUTH_SOURCE = process.env.MONGODB_AUTH_SOURCE || 'dummy';

    const MONGODB_URI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=${MONGODB_AUTH_SOURCE}`;

    mongoose.set('useFindAndModify', false);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true
    });
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
