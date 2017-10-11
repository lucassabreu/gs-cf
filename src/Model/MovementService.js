import PouchDB from 'pouchdb';
import Movement from '../Movement';

class MovementService {
  service = null;

  constructor(service) {
    this.service = service;
  }

  getDb() {
    if (window._database) {
      return window._database;
    }

    return window._database = new PouchDB('movements')
  }

  hasBeenLoaded() {
    return JSON.parse(localStorage.getItem('hasBeenLoaded')) === true;
  }

  async getMovements(filter) {
    let db = this.getDb();
    if (!this.hasBeenLoaded()) {
      let movements = await this.service.getAll()
      let promises = movements
        .map((m) => db.post(m));
      await Promise.all(promises)
      localStorage.setItem('hasBeenLoaded', JSON.stringify(true));
    }

    let result = await db.allDocs({ include_docs: true })
    return result.rows
      .map((r) => r.doc)
      .map(m => {
        let date = Date.parse(m.date);
        m.date = date;
        return m;
      })
      .map(m => new Movement(
        new Date(m.date),
        m.category,
        m.description,
        m.value,
        m.origin
      ));
  }

  async getMonths() {
    let movements = await this.getMovements();
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

        r[key][c.value < 0 ? 'debit' : 'credit'] += c.value;
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

export default MovementService