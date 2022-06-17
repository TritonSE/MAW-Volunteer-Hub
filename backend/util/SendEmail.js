/**
 * Email Sending Module
 * Contains functions for signup verification, site access notification, and messaging
 * Utilizes Nodemailer which uses Gmail SMTP Transport to deliver messages
 * and Google's OAuth2 for authentication.
 */

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const util = require("util");

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

    const msgText = `Dear ${user.name.split(" ")[0]}, \n
        Your account has been created. You will be notified when an administrator has approved 
        your account and given you access to the website. \nThanks, \nMAW SD`;

    const data = {
      to: user.email,
      subject: msgSubject,
      html: util.format(
        fs.readFileSync("./util/emails/signup.html").toString(),
        user.name.split(" ")[0]
      ),
      text: msgText,
      attachments: [
        {
          filename: "maw_logo.png",
          path: "./util/emails/maw_logo.png",
          cid: "maw_logo",
        },
      ],
    };

    const res = await transporter.sendMail(data);

    return res;
  },

  verify: async (user) => {
    const msgText = `Dear ${user.name.split(" ")[0]}, \n
      Your account has been approved. You can now access the website at: 
      ${config.app.frontend_url}/login" \nThanks, \nMAW SD`;

    const msgSubject = "Your Make-A-Wish San Diego account has been approved!";

    const data = {
      to: user.email,
      subject: msgSubject,
      html: util.format(
        fs.readFileSync("./util/emails/verify.html").toString(),
        user.name.split(" ")[0],
        config.app.frontend_url
      ),
      text: msgText,
      attachments: [
        {
          filename: "maw_logo.png",
          path: "./util/emails/maw_logo.png",
          cid: "maw_logo",
        },
      ],
    };

    const res = await transporter.sendMail(data);

    return res;
  },

  message: async (user, html, text, subject, roles) => {
    const data = {
      to: user.email,
      subject: `Message from Make-A-Wish: ${subject}`,
      html: util.format(
        fs.readFileSync("./util/emails/message.html").toString(),
        user.name.split(" ")[0],
        roles.join(", "),
        html,
        user.email,
        config.app.frontend_url
      ),
      text,
      attachments: [
        {
          filename: "maw_logo.png",
          path: "./util/emails/maw_logo.png",
          cid: "maw_logo",
        },
      ],
    };

    const res = await transporter.sendMail(data);

    return res;
  },

  reset: async (user) => {
    const text = `
      Dear ${user.name.split(" ")[0]},

      Your Make-A-Wish San Diego password request was received successfully. The following link is valid for 30 minutes, after
      which you must request a new one.

      Please go to the following address to reset your password: ${config.app.frontend_url}/reset/${
      user.resetCode
    }

      Thanks,
      MAW SD
    `;

    const res = await transporter.sendMail({
      to: user.email,
      subject: "Your Make-A-Wish San Diego password reset request",
      html: util.format(
        fs.readFileSync("./util/emails/reset.html").toString(),
        user.name.split(" ")[0],
        config.app.frontend_url,
        user.resetCode
      ),
      text,
      attachments: [
        {
          filename: "maw_logo.png",
          path: "./util/emails/maw_logo.png",
          cid: "maw_logo",
        },
      ],
    });

    return res;
  },
};
