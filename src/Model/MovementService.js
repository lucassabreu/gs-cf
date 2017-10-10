import PouchDB from 'pouchdb';

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
    const db = this.getDb();
    if (!this.hasBeenLoaded()) {
      const movements = this.service.getAll()
    }
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