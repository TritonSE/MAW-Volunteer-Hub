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
    from: `Make-A-Wish San Diego ${config.google_oauth.maw_email}`,
    replyTo: config.google_oauth.maw_email,
  }
);

module.exports = {
  signup: async (user) => {
    const msgSubject = "Thank you for joining Make-A-Wish San Diego!";

    const msgHtml = `
        <div>
            <p>Dear ${user.name.split(" ")[0]},</p>
            <p>Your account has been created. You will be notified when 
            an admin has approved your account and have access to the website.</p>
            <p>Thanks,<br/>MAW SD</p>
        </div>`;

    const msgText = `Dear ${user.name.split(" ")[0]}, \n
        Your account has been created. You will be notified when an admin has approved 
        your account and have access to the website. \nThanks, \nMAW SD`;

    const data = {
      to: user.email,
      subject: msgSubject,
      html: msgHtml,
      text: msgText,
    };

    const res = await transporter.sendMail(data);

    return res;
  },

  verify: async (user) => {
    const msgHtml = `
      <div>
          <p>Dear ${user.name.split(" ")[0]},</p>
          <p>Your account has been approved. You can now access the website at 
          <a href="https://maw-volunteer-hub.herokuapp.com/login" target="_blank"> 
          https://maw-volunteer-hub.herokuapp.com/login</a>.</p>
          <p>Thanks,<br/>MAW SD</p>
      </div>`;

    const msgText = `Dear ${user.name.split(" ")[0]}, \n
      Your account has been approved. You can now access the website at 
      https://maw-volunteer-hub.herokuapp.com/login" \nThanks, \nMAW SD`;

    const msgSubject = "Your Make-A-Wish San Diego account has been approved!";

    const data = {
      to: user.email,
      subject: msgSubject,
      html: msgHtml,
      text: msgText,
    };

    const res = await transporter.sendMail(data);

    return res;
  },

  sendEmailMessage: async () => {},
};
