/* global gapi */

import Movement from '../Movement';
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
    await GoogleAPIService.initGoogleAPI();

    const data = await this.promisify(gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `A:E`,
    }));

    return this.convertArrayToMovement(data);
  }

  convertArrayToMovement(data) {
    var movements = data.result.values.slice(1)
    return movements
      .map((array) => {
        const date = array[0].split('/');
        array[0] = new Date(date[2], (date[1] - 1), date[0]);
        array[3] = (array[3][0] === '-' ? -1 : 1) * parseFloat(array[3].trim().split(' ').slice(-1)[0])
        return array;
      })
      .map((array) => new Movement(...array))
  }
}