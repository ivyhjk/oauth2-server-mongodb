import { expect } from 'chai';
import { OAuth2Grant, OAuth2Scope } from './../../../src/mongoose';

describe('Grant model', () => {
  beforeEach(async () => {
    await OAuth2Grant.deleteMany({});
  });

  it('try to create a new grant without a name', async () => {
    let grant = null;

    try {
      grant = await OAuth2Grant.create({});
    } catch (e) {
      expect(e.message).to.equal('OAuth2Grant validation failed: name: Path `name` is required.');
    }

    expect(grant).to.be.null;
  });

  it('create a new grant', async () => {
    // at first, create some scopes.
    const firstScope = await OAuth2Scope.create({
      name: 'foo'
    });

    const secondScope = await OAuth2Scope.create({
      name: 'bar'
    });

    await OAuth2Grant.create({
      name: 'Foo',
      scopes: [
        firstScope._id.toString(),
        secondScope._id.toString(),
      ],
    });

    let grant = await OAuth2Grant.findOne({ name: 'Foo' }).populate('scopes');

    expect(grant).to.not.be.null;
    expect(grant.name).to.equal('Foo');
    expect(grant.scopes).to.have.lengthOf(2);
    expect(grant.scopes[0].name).to.equal('foo');
    expect(grant.scopes[1].name).to.equal('bar');
  });

  it('check timestamps', async () => {
    let scope = await OAuth2Grant.create({
      name: 'foo',
    });

    let updated = await OAuth2Grant.findOneAndUpdate(
      {
        name: 'foo',
      },
      {
        $set: {
          name: 'bar'
        }
      }
    );

    expect(scope.createdAt).to.exist;
    expect(scope.updatedAt).to.exist;
    expect(scope.createdAt.toTimeString()).to.be.equal(updated.createdAt.toTimeString());
    expect(scope.updatedAt).to.not.be.below(updated.updatedAt);
  });
});
