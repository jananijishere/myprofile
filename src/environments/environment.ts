// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  products: 'products',
  internalLogin: 'internal-login',
  createAccountURL: 'registration',
  hostURL: 'https://dev-register.agilent.com',
  oktaAuthN: '/api/v1/authn',
  sessionMe: '/api/v1/sessions/me',
  oktaAuthorizeURL: '/oauth2/default/v1/authorize',
  cryptoKey:randomString(32),
  cryptoIV:randomString(16),
  localeServURL: 'https://clc-dev.dev-19.aws.agilent.com/unified-login/api/v1/locale/info?localId=',
  mfaSupporMailId: 'support.mfa@mailinator.com',
  gaUrl: '//www.googletagmanager.com/gtag/js?id=',
  cookieContext: '/login',
  cookieDomain:'.agilent.com',
  cookieCrossSite:'Lax',
  homeURL:'https://www.agilent.com'
};

function randomString(len) {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
