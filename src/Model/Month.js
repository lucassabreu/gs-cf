import Moviment from './Movement'

export default class Month {
  /**
   * @param {Object} param
   * @param {*} param.index
   * @param {Date} param.month
   * @param {Number} param.balance
   * @param {Number} param.credit
   * @param {Number} param.debit
   * @param {Moviment[]} param.moviments
   */
  constructor({ index, month, balance, credit, debit, moviments }) {
    this.month = month;
    this.index = index;
    this.balance = balance;
    this.credit = credit;
    this.debit = debit;
    this.moviments = moviments;
  }
}