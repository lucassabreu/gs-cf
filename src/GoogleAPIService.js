/* global gapi */

const PARAMS = {
  apiKey: 'AIzaSyCZ5_w5a91cUJVYStFGouS4ffbVgzkBk_E',
  clientId: '723341089127-thkukv2q6u8vfithe30h1qciemdhasae.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
};

class GoogleAPIService {
  initGoogleAPI() {
    return new Promise((f, r) => {
      if (window.gapi) {
        return f();
      }

      const script = document.createElement("script");
      script.src = "//apis.google.com/js/api.js";
      script.onload = () => {
        gapi.load('client:auth2', () => gapi.client.init(PARAMS).then(f))
      }

      document.body.append(script);
    });
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
}

export default new GoogleAPIService();
