export default class User {
  /**
   * @param {String} name
   * @param {String} email
   * @param {String} image
   */
  constructor(name, email, image) {
    this.name = name;
    this.email = email;
    this.image = image;
  }

  /**
   * @returns {String}
   */
  toJSON() {
    return JSON.stringify({ name: this.name, email: this.email, image: this.image })
  }

  /**
   * @param {String} json 
   */
  static fromJSON(json) {
    let data = JSON.parse(json);
    if (data === null) {
      return null;
    }
    return new User(data.name, data.email, data.image);
  }
}