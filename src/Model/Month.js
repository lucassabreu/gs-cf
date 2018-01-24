export default class Month {
  month = null;
  index = null;
  balance = null;
  credit = null;
  debit = null;
  movements = null;
  prev = null;
  next = null;

  /**
   * @param {Object} param
   * @param {*} param.index
   * @param {Date} param.month
   * @param {Number} param.balance
   * @param {Number} param.credit
   * @param {Number} param.debit
   * @param {Movement[]} param.movements
   */
  constructor({ index, month, balance, credit, debit, movements }) {
    this.month = month;
    this.index = index;
    this.balance = balance || 0;
    this.credit = credit || 0;
    this.debit = debit || 0;
    this.movements = movements || [];
  }

  /**
   * @param {Movement} movement
   * @return {Month} this
   */
  addMovement(movement) {
    this[movement.value > 0 ? 'credit' : 'debit'] += movement.value;
    this.balance += movement.value;
    this.movements.push(movement);

    return this;
  }
}