/* global gapi */

import GoogleAPIService from './GoogleAPIService'
import promisify from './promisify'
import Movement from '../Model/Movement'
import Month from '../Model/Month'

export default class Sheet {
  id = null;
  googleAPIService = null
  _allMovements = null
  _months = null;

  /**
   * @param {string} id
   * @param {GoogleAPIService} googleAPIService
   */
  constructor(id, googleAPIService) {
    this.id = id
    this.googleAPIService = googleAPIService
  }

  /**
   * @returns {String}
   */
  getId() {
    return this.id;
  }

  /**
   * @returns {Movement[]}
   */
  async getAll() {
    if (this._allMovements !== null) {
      return this._allMovements
    }

    await GoogleAPIService.initSheetsAPI();
    const data = await promisify(gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.id,
      range: "A:E",
    }));

    let rows = data.result.values.slice(1);
    let movements = [];
    for (var index in rows) {
      let row = rows[index];
      let value = parseFloat(row[3].replace(/[^-0-9.]/g, ''));

      if (value === 0) {
        continue;
      }

      let dateParts = row[0].split('/');
      let date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);

      movements.push(new Movement(index + 1, date, row[1], row[2], value, row[4]));
    }

    return this._allMovements = movements;
  }

  /**
   * Get all Movements from a filter
   * @param {Object} filter
   * @param {Date} filter.month Month to filter
   * @param {Date} filter.start Start nonth to filter
   * @param {Date} filter.end End month to filter
   * @param {String[]} filter.categories Categories to filter
   * @param {RegExp} filter.description Description to filter
   * @returns {Movement[]}
   */
  async getMovements({ month, start, end, categories, description }) {
    let movements = await this.getAll();

    if (month) {
      return movements.filter(m => (
        m.date.getFullYear() === month.getFullYear() &&
        m.date.getMonth() === month.getMonth()
      ));
    }

    if (start) {
      movements = movements.filter(m => m.date >= start);
    }

    if (end) {
      movements = movements.filter(m => m.date < end);
    }

    if (categories && categories.length > 0) {
      movements = movements.filter(m => categories.indexOf(m.category) !== -1)
    }

    if (description) {
      movements = movements.filter(m => m.description.match(description) === null)
    }

    return movements
  }

  async getAllMonths() {
    if (this._months != null) {
      return this._months;
    }

    const dateToKey = (date) => parseInt(
      date.toISOString()
        .substring(0, 7)
        .replace(/[^0-9]/g, ''),
      10
    );

    const movements = await this.getAll();
    let months = movements
      .reduce((months, movement) => {
        const key = dateToKey(movement.date);
        if (!months[key]) {
          months[key] = new Month({
            index: key,
            month: movement.getMonth(),
          })
        }

        months[key]
          .addMovement(movement);
        return months;
      }, [])
      .map((month, index, months) => {
        let prevMonth = new Date(month.month);
        prevMonth.setDate(0)

        const prevIndex = dateToKey(prevMonth);
        month.setPrev(months[prevIndex]);

        return month;
      })
      .sort((n, p) => n.index - p.index);

    this._months = [];
    for (let key in months) {
      this._months.push(months[key]);
    }

    return this._months;
  }

  /**
   * Get all Months from a filter
   * @param {Object} filter
   * @param {Date} filter.month Month to filter
   * @param {Date} filter.start Start nonth to filter
   * @param {Date} filter.end End month to filter
   * @returns {Month[]}
   */
  async getMonths({ month, start, end }) {
    let months = await this.getAllMonths();

    if (month) {
      return months.filter(m => (
        m.month.getFullYear() === month.getFullYear() &&
        m.month.getMonth() === month.getMonth()
      ));
    }

    if (start) {
      start = new Date(start);
      start.setDate(1)
      months = months.filter((m) => {
        return m.month >= start;
      })
    }

    if (end) {
      end = new Date(end);
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
      months = months.filter((m) => {
        return m.month <= end;
      })
    }

    return months;
  }

  /**
   * @param {Date} date
   * @returns {Number}
   */
  async getBalanceAt(date) {
    let movements = await this.getMovements({ end: date })
    return movements.reduce((prev, movement) => prev + movement.getValue(), 0);
  }

  /**
   * @param {Date} date
   * @returns {Number}
   */
  async getTotalMovementAt(date) {
    let movements = await this.getMovements({ end: date })
    return movements.reduce((prev, movement) => prev + Math.asb(movement.getValue()), 0);
  }

  /**
   * @param {Date} date
   * @returns {Number}
   */
  async getCreditAt(date) {
    let movements = await this.getMovements({ end: date })
    return movements
      .filter(m => m.value > 0)
      .reduce((prev, movement) => prev + movement.getValue(), 0);
  }

  /**
   * @param {Date} date
   * @returns {Number}
   */
  async getDebtAt(date) {
    let movements = await this.getMovements({ end: date })
    return movements
      .filter(m => m.value < 0)
      .reduce((prev, movement) => prev + movement.getValue(), 0);
  }
}