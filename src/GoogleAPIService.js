/* global gapi */

const API_KEY = 'AIzaSyCZ5_w5a91cUJVYStFGouS4ffbVgzkBk_E';
const CLIENT_ID = '723341089127-thkukv2q6u8vfithe30h1qciemdhasae.apps.googleusercontent.com';
const DISCOVERY_DOCS = [ 'https://sheets.googleapis.com/$discovery/rest?version=v4' ];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

class GoogleAPIService {
  scriptLoaded = false;

  loadOAuthInternal(cb) {
    gapi.load('client:auth2', () => {
      gapi.client.init ({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scopes: SCOPES,
      }).then(() => {
        const oauth = gapi.auth2.getAuthInstance();
        if (oauth === null) {
          cb(false)
          return;
        }

        gapi.auth2.getAuthInstance().isSignedIn.listen(cb);
        cb(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }

  onLoadOAuth(cb) {
    if (this.scriptLoaded) {
      this.loadOAuthInternal(cb)
      return
    }

    const script = document.createElement("script");
    script.src = "//apis.google.com/js/api.js";
    document.body.append(script);

    script.onload = () => this.loadOAuthInternal(cb);
  }
}

export default new GoogleAPIService();
