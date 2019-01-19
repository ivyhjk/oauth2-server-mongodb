import { expect } from 'chai';
import { OAuth2Scope } from './../../../src/mongoose';

describe('Scope model', () => {
  beforeEach(async () => {
    await OAuth2Scope.deleteMany({});
  });

  it('try to create a new scope without a name', async () => {
    let scope = null;

    try {
      scope = await OAuth2Scope.create({});
    } catch (e) {
      expect(e.message).to.equal('OAuth2Scope validation failed: name: Path `name` is required.');
    }

    expect(scope).to.be.null;
  });

  it('create a new scope', async () => {
    await OAuth2Scope.create({
      name: 'Foo',
      description: 'Bar baz'
    });

    let scope = await OAuth2Scope.findOne({ name: 'Foo' });

    expect(scope).to.not.be.null;
    expect(scope.name).to.equal('Foo');
    expect(scope.description).to.equal('Bar baz');
  });

  it('check timestamps', async () => {
    let scope = await OAuth2Scope.create({
      name: 'foo',
    });

    let updated = await OAuth2Scope.findOneAndUpdate(
      {
        name: 'foo',
      },
      {
        $set: {
          description: 'bar'
        }
      }
    );

    expect(scope.createdAt).to.exist;
    expect(scope.updatedAt).to.exist;
    expect(scope.createdAt.toTimeString()).to.be.equal(updated.createdAt.toTimeString());
    expect(scope.updatedAt).to.not.be.below(updated.updatedAt);
  });
});
