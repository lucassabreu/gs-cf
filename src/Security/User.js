export default class User {
  /**
   * @param {String} name
   * @param {String} email
   */
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  /**
   * @returns {String}
   */
  toJSON() {
    return JSON.stringify({ user: this.user, email: this.email })
  }

  /**
   * @param {String} json 
   */
  static fromJSON(json) {
    let data = JSON.parse(json);
    if (data === null) {
      return null;
    }
    return new User(data.name, data.email);
  }
}