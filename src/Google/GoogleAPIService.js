/* global gapi */

import promisify from './promisify';

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

  async listFiles(nextPageToken) {
    await this.initGoogleDriveAPI()

    const response = await promisify(gapi.client.drive.files.list({
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
    await promisify(gapi.client.load('drive', 'v3'));
  }

  async initSheetsAPI() {
    await this.initGoogleAPI();
    await promisify(gapi.client.load('sheets', 'v4'));
  }

  async initGoogleAPI() {
    await this.loadGAPI();
    await new Promise((f, r) => gapi.load('client:auth2', () => f()));
    await promisify(gapi.client.init(PARAMS));
  }

  async loadGAPI() {
    await new Promise((f, r) => {
      if (window.gapi) {
        return f();
      }

      const script = document.createElement("script");
      script.src = "//apis.google.com/js/api.js";
      script.onload = (event) => f();
      document.body.append(script);
    });
  }
}

export default new GoogleAPIService();
