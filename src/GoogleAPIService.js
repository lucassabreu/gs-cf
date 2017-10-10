/* global gapi */

import Movement from './Movement';

const PARAMS = {
  apiKey: 'AIzaSyCZ5_w5a91cUJVYStFGouS4ffbVgzkBk_E',
  clientId: '723341089127-thkukv2q6u8vfithe30h1qciemdhasae.apps.googleusercontent.com',
  discoveryDocs: [
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  ],
  scope: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ].join(' '),
};

class GoogleAPIService {

  async getSheetData(id) {
    await this.initGoogleAPI();

    const data = await this.promisify(gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: id,
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

  async listFiles(nextPageToken) {
    await this.initGoogleDriveAPI()

    const response = await this.promisify(gapi.client.drive.files.list({
      nextPageToken: nextPageToken,
      q: `mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
      fields: 'nextPageToken, files(id, name, parents)',
    }));

    return response.result;
  }

  async listenOnIsSignedIn(cb) {
    await this.initGoogleAPI();

    const oauth = gapi.auth2.getAuthInstance();
    oauth.isSignedIn.listen(cb)
    cb(oauth.isSignedIn.get())
  }

  async signIn() {
    await this.initGoogleAPI();
    gapi.auth2.getAuthInstance().signIn();
  }

  async signOut() {
    await this.initGoogleAPI();
    gapi.auth2.getAuthInstance().signOut();
  }

  async initGoogleDriveAPI() {
    await this.initGoogleAPI();
    await this.promisify(gapi.client.load('drive', 'v3'));
  }

  promisify(gp) {
    return new Promise((f, r) => gp.then(f, r))
  }

  initGoogleAPI() {
    return new Promise((f, r) => {
      if (window.gapi) {
        return f();
      }

      const script = document.createElement("script");
      script.src = "//apis.google.com/js/api.js";
      document.body.append(script);
      script.onload = () => gapi.load('client:auth2', () => gapi.client.init(PARAMS).then(f, r))
    });
  }
}

export default new GoogleAPIService();
