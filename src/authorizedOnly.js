import GoogleAPIService from './Google/GoogleAPIService';

export default function authorizedOnly() {
  GoogleAPIService.listenOnIsSignedIn((isSignedIn) => {
    if (isSignedIn === false) {
      // router.push('/login');
    }
  })
}