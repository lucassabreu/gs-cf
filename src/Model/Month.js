export default class Month {
  month = null;
  index = null;
  balance = null;
  credit = null;
  debit = null;
  movements = null;
  prev = null;
  next = null;
  final = 0;
  initial = 0;

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
    this.final += movement.value;
    this.movements.push(movement);

    return this;
  }

  /**
   * @param {Month} [prevMonth]
   * @return {Month}
   */
  setPrev(prevMonth) {
    const initial = this.initial;
    if (this.prev) {
      this.initial = 0;
      this.final -= this.prev.final;
    }

    this.prev = prevMonth;
    if (prevMonth) {
      this.initial = this.prev.final;
      this.final += this.prev.final;
      this.prev.next = this;
    }

    if (this.next && this.initial !== initial) {
      this.next.setPrev(this);
    }

    return this;
  }
}