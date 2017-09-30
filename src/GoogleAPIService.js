/* global gapi */

class GoogleAPIService {
  scriptLoaded = false;

  loadOAuthInternal(cb) {
    gapi.load('client:auth2', () => {
      gapi.client.init ({
        apiKey: 'AIzaSyCZ5_w5a91cUJVYStFGouS4ffbVgzkBk_E',
        clientId: '723341089127-thkukv2q6u8vfithe30h1qciemdhasae.apps.googleusercontent.com',
        discoveryDocs: [ 'https://sheets.googleapis.com/$discovery/rest?version=v4' ],
        scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
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
    script.src = "https://apis.google.com/js/client.js";
    document.body.append(script);

    script.onload = () => this.loadOAuthInternal(cb);
  }
}

export default new GoogleAPIService();
