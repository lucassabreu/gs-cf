/* global gapi */

import promisify from './promisify';
import User from '../Security/User';

const PARAMS = {
  apiKey: 'AIzaSyCE9M0o3QzQzCPMoWf6WwFa9hrJ_GqfPaM',
  clientId: '723341089127-5ejivrd32lqg8m3ns4njdnfsj4v74qs4.apps.googleusercontent.com',
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
  _loginListeners = [];
  _isListening = false;
  _isSignedIn = null;
  _user = null;

  constructor() {
    this._listenAuth = this._listenAuth.bind(this);
  }

  async listFiles(nextPageToken) {
    await this.initGoogleDriveAPI()

    const response = await promisify(gapi.client.drive.files.list({
      nextPageToken: nextPageToken,
      q: `mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
      fields: 'nextPageToken, files(id, name, parents)',
    }));

    return response.result;
  }

  _listenAuth(isSignedIn) {
    const oauth = gapi.auth2.getAuthInstance();

    this._isSignedIn = isSignedIn;

    this._user = null;
    if (this._isSignedIn) {
      const profile = oauth.currentUser.get().getBasicProfile();
      this._user = new User(
        profile.getName(),
        profile.getEmail(),
        profile.getImageUrl()
      );
    }

    localStorage.setItem('isSignedIn', this._isSignedIn);
    localStorage.setItem('user', this._user ? this._user.toJSON() : null);

    const state = {
      isSignedIn: this._isSignedIn,
      user: this._user,
    };

    this._loginListeners.forEach((cb) => cb(state));
  }

  /**
   * @param {Function} callback
   */
  async addLoginListener(callback) {
    if (this._loginListeners.indexOf(callback) !== -1) {
      return;
    }

    this._loginListeners.push(callback);
    await this.initGoogleAPI();
  }

  /**
   * @param {Function} callback
   */
  removeLoginListener(callback) {
    const index = this._loginListeners.indexOf(callback);
    if (index === -1) {
      return;
    }

    this._loginListeners.splice(index);
  }

  isSignedIn() {
    if (this._isSignedIn === null) {
      this._isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'))
    }

    return this._isSignedIn;
  }

  getUser() {
    if (this._user === null) {
      this._user = User.fromJSON(localStorage.getItem('user'))
    }
    return this._user;
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
    await new Promise((f, r) => gapi.load('client:auth2', {
      callback: f,
      onerror: r,
    }));
    await promisify(gapi.client.init(PARAMS));

    if (this._isListening) {
      return;
    }

    const oauth = gapi.auth2.getAuthInstance();
    oauth.isSignedIn.listen(this._listenAuth)
    this._listenAuth(oauth.isSignedIn.get())
    this._isListening = true;
  }

  async loadGAPI() {
    await new Promise((f, r) => {
      if (window.gapi) {
        return f();
      }

      const script = document.createElement("script");
      script.src = "//apis.google.com/js/api.js";
      script.onload = f;
      script.onerror = r;
      document.body.append(script);
    });
  }
}

export default new GoogleAPIService();
