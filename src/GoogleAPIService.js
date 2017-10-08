/* global gapi */

import Moviment from './Moviment';

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

  getSheetData(id) {
    return this.initGoogleAPI()
      .then(() => {
        return new Promise((f, r) => {
          gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: id,
            range: `A:E`,
          }).then(f, r)
        })
      }).then((data) => this.convertArrayToMoviment(data));
  }

  convertArrayToMoviment(data) {
    var moviments = data.result.values.slice(1)
    return moviments
      .map((array) => {
        const date = array[0].split('/');
        array[0] = new Date(date[2], (date[1] - 1), date[0]);
        array[3] = (array[3][0] === '-' ? -1 : 1) * parseFloat(array[3].trim().split(' ').slice(-1)[0])
        return array;
      })
      .map((array) => new Moviment(...array))
  }

  listFiles(nextPageToken) {
    return this.initGoogleDriveAPI()
      .then(() => {
        return new Promise((f, r) => {
          gapi.client.drive.files.list({
            nextPageToken: nextPageToken,
            q: `mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
            fields: 'nextPageToken, files(id, name, parents)',
          })
            .then(f, r);
        });
      })
      .then((response) => response.result);
  }

  listenOnIsSignedIn(cb) {
    this.initGoogleAPI().then(() => {
      const oauth = gapi.auth2.getAuthInstance();
      oauth.isSignedIn.listen(cb)
      cb(oauth.isSignedIn.get())
    });
  }

  signIn() {
    return this.initGoogleAPI()
      .then(() => gapi.auth2.getAuthInstance().signIn());
  }

  signOut() {
    return this.initGoogleAPI()
      .then(() => gapi.auth2.getAuthInstance().signOut());
  }

  initGoogleDriveAPI() {
    return this.initGoogleAPI()
      .then(() => new Promise((f, r) => gapi.client.load('drive', 'v3').then(f, r)));
  }

  initGoogleAPI() {
    return new Promise((f, r) => {
      if (window.gapi) {
        return f();
      }

      const script = document.createElement("script");
      script.src = "//apis.google.com/js/api.js";
      script.onload = () => gapi.load('client:auth2', () => gapi.client.init(PARAMS).then(f, r))
      document.body.append(script);
    });
  }
}

export default new GoogleAPIService();
