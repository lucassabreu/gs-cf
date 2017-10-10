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
      const movements = service.getAll()
    }
  }
}

export default MovementService