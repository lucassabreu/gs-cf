/* global gapi */

import promisify from './promisify';
import GoogleAPIService from './GoogleAPIService';

export default class SheetAPIService {

  sheetId = null;

  constructor({ sheetId }) {
    this.sheetId = sheetId;
  }

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
      if (!date.toISOString()) {
        console.log(date);
        throw new Error();
      }

      moviments.push({
        _id: index + 1,
        date: date.toISOString(),
        category: array[1],
        description: array[2],
        value: (array[3][0] === '-' ? -1 : 1) * parseFloat(array[3].trim().split(' ').slice(-1)[0]),
        origin: array[4],
      });
    }
    return moviments;
  }
}