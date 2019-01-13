import Argon2 from 'argon2';

export default function (schema) {
  const passwordHasher = async function (next) {
    if (typeof this._update !== 'undefined') {
      if (
        typeof this._update.password !== 'undefined'
        && this._update.password
      ) {
        this._update.password = await Argon2.hash(this._update.password);
      }
    } else if (typeof this.password !== 'undefined' && this.password) {
      this.password = await Argon2.hash(this.password);
    }

    next();
  };

  schema.pre('findOneAndUpdate', passwordHasher);
  schema.pre('updateOne', passwordHasher);
  schema.pre('save', passwordHasher);
}
