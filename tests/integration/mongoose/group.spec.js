import { expect } from 'chai';
import { OAuth2Group } from './../../../src/mongoose';

describe('Group model', () => {
  beforeEach(async () => {
    await OAuth2Group.deleteMany({});
  });

  it('try to create a new group without a name', async () => {
    let group = null;

    try {
      group = await OAuth2Group.create({});
    } catch (e) {
      expect(e.message).to.equal('OAuth2Group validation failed: name: Path `name` is required.');
    }

    expect(group).to.be.null;
  });

  it('create a new group', async () => {
    await OAuth2Group.create({
      name: 'Foo',
      scopes: [
        'foo',
        'bar',
      ],
    });

    let group = await OAuth2Group.findOne({ name: 'Foo' });

    expect(group).to.not.be.null;
    expect(group.name).to.equal('Foo');
    expect(group.scopes).to.have.lengthOf(2);
    expect(group.scopes[0]).to.equal('foo');
    expect(group.scopes[1]).to.equal('bar');
  });

  it('check timestamps', async () => {
    let scope = await OAuth2Group.create({
      name: 'foo',
    });

    let updated = await OAuth2Group.findOneAndUpdate(
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
