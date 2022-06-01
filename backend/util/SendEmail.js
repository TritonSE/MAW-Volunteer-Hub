const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;
const config = require("../config");

const oauth2Client = new OAuth2(
  config.google_oauth.client_id,
  config.google_oauth.client_secret,
  config.google_oauth.redirect
);

oauth2Client.setCredentials({
  refresh_token: config.google_oauth.refresh_token,
});

const transporter = nodemailer.createTransport(
  {
    host: "smtp.gmail.com",
    auth: {
      type: "OAuth2",
      user: config.google_oauth.maw_email,
      clientId: config.google_oauth.client_id,
      clientSecret: config.google_oauth.client_secret,
      refreshToken: config.google_oauth.refresh_token,
      accessToken: oauth2Client.getAccessToken(),
    },
    secure: true,
  },
  {
    from: config.google_oauth.maw_email,
  }
);

module.exports = {
  sendEmailSignup: async (user) => {},

  sendEmailVerify: async (user) => {},
};
