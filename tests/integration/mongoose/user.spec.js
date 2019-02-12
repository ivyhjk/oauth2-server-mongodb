import { expect } from 'chai';
import Argon2 from 'argon2';
import { OAuth2User, OAuth2Group } from './../../../src/mongoose';

describe('User model', () => {
  beforeEach(async () => {
    await OAuth2User.deleteMany({});
  });

  it('create a new user', async () => {
    const firstGroup = await OAuth2Group.create({ 'name': 'first group' });
    const secondGroup = await OAuth2Group.create({ 'name': 'second group' });

    await OAuth2User.create({
      groups: [firstGroup._id.toString(), secondGroup._id.toString()],
      name: 'the name',
      username: 'A Username',
      password: 'password',
      email: 'example@example.com',
    });

    // note the lowercased U of "username".
    const user = await OAuth2User.findOne({ username: 'A username' })
      .populate('groups');

    expect(user).to.not.be.null;
    expect(user.username).to.equal('a username');
    expect(user.name).to.equal('the name');
    expect(user.email).to.equal('example@example.com');
    expect(user.password).to.not.be.equal('password');
    expect(user.groups).to.be.an('array');
    expect(user.groups[0].name).to.be.equal('first group');
    expect(user.groups[1].name).to.be.equal('second group');
    expect(user.active).to.be.true;
  });

  it(
    'try to update the user password and check if new password is hashed or not',
    async () => {
      const user = await OAuth2User.create({
        name: 'the name',
        username: 'A Username',
        password: 'password',
        email: 'example@example.com',
      });

      // expect password is not touched, we just are updating the email.
      await OAuth2User.updateOne(
        { _id: user._id.toString() },
        { $set: { email: 'another@example.com' } }
      );

      const updated = await OAuth2User.findOne({ _id: user._id.toString() });

      expect(updated.email).to.be.equal('another@example.com');
      expect(updated.password).to.be.equal(user.password);

      // now we are updating the password.
      await OAuth2User.updateOne(
        { _id: user._id.toString() },
        { $set: { password: 'the new password' } }
      );

      const anotherUpdate = await OAuth2User.findOne({ _id: user._id.toString() });

      expect(anotherUpdate.password).to.not.be.equal(user.password);
      expect(anotherUpdate.password).to.not.be.equal('the new password');
      expect(
        await Argon2.verify(anotherUpdate.password, 'the new password')
      ).to.be.true;
    }
  );
});
