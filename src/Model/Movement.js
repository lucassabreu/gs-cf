export default class Movement {
  /**
   * @member {*}
   */
  id = null;
  /**
   * @member {Date}
   */
  date = null;
  /**
   * @member {String}
   */
  category = null;
  /**
   * @member {String}
   */
  description = null;
  /**
   * @member {Number}
   */
  value = null;
  /**
   * @member {String}
   */
  origin = null;

  /**
   * @param {String} id
   * @param {Date} date
   * @param {String} category
   * @param {String} description
   * @param {Number} value
   * @param {String} origin
   */
  constructor(id, date, category, description, value, origin) {
    if (!(date instanceof Date)) {
      throw new Error("Must be a instance of Date " + date + " passed");
    }

    if (isNaN(value)) {
      throw new Error("Value is invalid");
    }

    this.id = id;
    this.date = date;
    this.category = category;
    this.description = description;
    this.value = value;
    this.origin = origin;
  }

  getMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  }

  getMonthString() {
    const m = this.date.getMonth();
    return this.date.getFullYear() + '-' + (m > 9 ? m : '0' + m);
  }

  getValue() {
    if (
      this.category === 'Pagamento de cartão' ||
      this.category === 'Resgate' ||
      this.category === 'Aplicação' ||
      this.category === 'Transferência'
    ) {
      return 0;
    }
    return this.value;
  }
}
