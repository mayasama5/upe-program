const { google } = require('googleapis');

const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8000/api/auth/google/callback'
};

/**
 * Crea un cliente OAuth2 de Google
 */
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    GOOGLE_CONFIG.clientId,
    GOOGLE_CONFIG.clientSecret,
    GOOGLE_CONFIG.redirectUri
  );
};

/**
 * Genera la URL de autorización de Google
 * @param {string} role - Rol del usuario (opcional: 'estudiante' o 'empresa')
 */
const getAuthUrl = (role = 'estudiante', redirectUri = null) => {
  // Allow passing a redirectUri at runtime (useful when env is not set in production)
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CONFIG.clientId,
    GOOGLE_CONFIG.clientSecret,
    redirectUri || GOOGLE_CONFIG.redirectUri
  );

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: role // Pass role as state parameter
  });
};

/**
 * Obtiene los tokens usando el código de autorización
 */
const getTokensFromCode = async (code) => {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

/**
 * Obtiene la información del usuario de Google
 */
const getUserInfo = async (accessToken) => {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  const { data } = await oauth2.userinfo.get();
  return data;
};

module.exports = {
  GOOGLE_CONFIG,
  getOAuth2Client,
  getAuthUrl,
  getTokensFromCode,
  getUserInfo
};
