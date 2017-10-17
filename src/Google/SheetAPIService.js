/* global gapi */

import promisify from './promisify';
import GoogleAPIService from './GoogleAPIService';
import Movement from '../Movement';

export default class SheetAPIService {

  sheetId = null;

  /**
   * @param {Object} params Parameters
   * @param {string} params.sheetId Id of the sheet in use
   */
  constructor({ sheetId }) {
    this.sheetId = sheetId;
  }

  /**
   * @returns {string}
   */
  getSheetId() {
    return this.sheetId;
  }

  async getAll() {
    await GoogleAPIService.initGoogleDriveAPI();
    const data = await promisify(gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `A:E`,
    }));

    let rows = data.result.values.slice(1);
    let moviments = [];
    for (var index in rows) {
      let array = rows[index];
      let dateParts = array[0].split('/');
      let date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);

      array[3] = array[3].trim().replace(/,/, '');

      moviments.push({
        _id: index + 1,
        date: date,
        category: array[1],
        description: array[2],
        value: (array[3][0] === '-' ? -1 : 1) * parseFloat(array[3].split(' ').slice(-1)[0]),
        origin: array[4],
      });
    }
    return moviments.filter(m => m.value !== 0);
  }

  /**
   * Get all Moviments from a filter
   * @param {Object} filter 
   * @param {Date} filter.month Month to filter
   */
  async getMovements({ month }) {
    let rows = await this.getAll();

    if (month) {
      rows = rows.filter(m => (
        m.date.getFullYear() === month.getFullYear() &&
        m.date.getMonth() === month.getMonth()
      ));
    }

    return rows.map(m => new Movement(
      new Date(m.date),
      m.category,
      m.description,
      m.value,
      m.origin
    ));
  }

  async getMonths() {
    let movements = await this.getMovements({});
    return this.reduceToMonth(movements);
  }

  reduceToMonth(movements) {
    const monthHash = movements.reduce(
      (r, c) => {
        var key = parseInt(c.getMonthString().replace(/-/, ''), 10);
        if (r[key] === undefined) {
          r[key] = {
            month: c.getMonth(),
            key: key,
            balance: 0,
            credit: 0,
            debit: 0,
            movements: [],
          }
        }

        let value = c.getValue();

        r[key][value < 0 ? 'debit' : 'credit'] += value;
        r[key].balance += c.value;
        r[key].movements.push(c)

        return r
      },
      {}
    );

    var months = [];
    for (var key in monthHash) {
      months.push(monthHash[key]);
    }

    months = months.sort((n, p) => n.key - p.key)

    for (key in months) {
      var m = months[key];
      var prev = months[key - 1];
      m.prev = prev;
      m.initial = prev ? prev.final : 0;
      m.final = m.initial + m.balance;
    }

    return months
  }
}