export const environment = {
  production: true,
  products: 'products',
  internalLogin: 'internal-login',
  createAccountURL: 'registration',
  hostURL: 'https://stgwww.agilent.com',
  oktaAuthN: '/api/v1/authn',
  sessionMe: '/api/v1/sessions/me',
  oktaAuthorizeURL: '/oauth2/default/v1/authorize',
  cryptoKey:randomString(32),
  cryptoIV:randomString(16),
  localeServURL: '/unified-login/api/v1/locale/info?localId=',
  mfaSupporMailId: 'support@agilent.com',
  gaUrl: '//www.googletagmanager.com/gtag/js?id=',
  cookieContext: '/login',
  cookieDomain:'.agilent.com',
  cookieCrossSite:'Lax',
  homeURL:'https://stgwww.agilent.com'
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