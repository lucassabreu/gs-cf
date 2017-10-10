import GoogleAPIService from './Google/GoogleAPIService';

export default function authorizedOnly({ props, router }) {
  GoogleAPIService.listenOnIsSignedIn((isSignedIn) => {
    if (isSignedIn === false) {
      router.push('/login');
    }
  })
}