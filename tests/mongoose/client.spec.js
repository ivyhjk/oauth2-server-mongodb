import { expect } from 'chai';
import { OAuth2Client, OAuth2Scope } from './../../src/mongoose';

describe('Client model', () => {
  beforeEach(async () => {
    await OAuth2Client.deleteMany({});
  });

  it('try to create a new client without a name', async () => {
      let client = null;

      try {
        client = await OAuth2Client.create({
          redirectUris: ['/']
        });
      } catch (e) {
        expect(e.message).to.equal('OAuth2Client validation failed: name: Path `name` is required.');
      }

      expect(client).to.be.null;
  });

  it('try to create a new client without redirect uris', async () => {
      let client = null;

      try {
        client = await OAuth2Client.create({
          name: 'Foo'
        });
      } catch (e) {
        expect(e.message).to.equal('OAuth2Client validation failed: redirectUris: please specify at least one redirect uri.');
      }

      expect(client).to.be.null;
  });

  it('create a new simple client', async () => {
    await OAuth2Client.create({
      name: 'Foo',
      redirectUris: ['/bar', '/baz'],
    });

    let client = await OAuth2Client.findOne({name: 'Foo'});

    expect(client).to.not.be.null;
    expect(client.name).to.equal('Foo');
    expect(client.redirectUris).to.be.an('array').that.includes('/bar');
    expect(client.redirectUris).to.be.an('array').that.includes('/baz');
    expect(client.secret).to.exist;
  });

  it('create a new client', async () => {
    // at first, create some scopes.
    const firstScope = await OAuth2Scope.create({
      name: 'foo'
    });

    const secondScope = await OAuth2Scope.create({
      name: 'bar'
    });

    await OAuth2Client.create({
      scopes: [
        firstScope._id.toString(),
        secondScope._id.toString(),
      ],
      grants: [
        'password',
      ],
      name: 'Custom client',
      redirectUris: ['/dashboard', '/other'],
    });

    let client = await OAuth2Client.findOne({ name: 'Custom client' }).populate('scopes');

    expect(client).to.not.be.null;
    expect(client.name).to.equal('Custom client');
    expect(client.redirectUris).to.be.an('array').that.includes('/dashboard');
    expect(client.redirectUris).to.be.an('array').that.includes('/other');
    expect(client.grants).to.be.an('array').that.includes('password');
    expect(client.secret).to.exist;
    expect(client.scopes).to.have.lengthOf(2);
    expect(client.scopes[0].name).to.equal('foo');
    expect(client.scopes[1].name).to.equal('bar');
  });

  it('check timestamps', async () => {
    let client = await OAuth2Client.create({
      name: 'foo',
      redirectUris: ['/'],
    });

    let updated = await OAuth2Client.findOneAndUpdate(
      {
        name: 'foo',
      },
      {
        $set: {
          redirectUris: ['/bar', '/baz']
        }
      }
    );

    expect(client.createdAt).to.exist;
    expect(client.updatedAt).to.exist;
    expect(client.createdAt.toTimeString()).to.be.equal(updated.createdAt.toTimeString());
    expect(client.updatedAt).to.not.be.below(updated.updatedAt);
  });
});
