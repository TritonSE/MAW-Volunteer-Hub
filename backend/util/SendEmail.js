/**
 * Email Sending Module
 * Contains functions for signup verification, site access notification, and messaging
 * Utilizes Nodemailer which uses Gmail SMTP Transport to deliver messages
 * and Google's OAuth2 for authentication.
 */

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
            an administrator has approved your account and given you access to the website.</p>
            <p>Thanks,<br/>MAW SD</p>
        </div>`;

    const msgText = `Dear ${user.name.split(" ")[0]}, \n
        Your account has been created. You will be notified when an administrator has approved 
        your account and given you access to the website. \nThanks, \nMAW SD`;

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
          <p>Your account has been approved. You can now access the website at: 
          <a href="${config.app.frontend_url}/login" target="_blank"> 
          ${config.app.frontend_url}/login</a></p>
          <p>Thanks,<br/>MAW SD</p>
      </div>`;

    const msgText = `Dear ${user.name.split(" ")[0]}, \n
      Your account has been approved. You can now access the website at: 
      ${config.app.frontend_url}/login" \nThanks, \nMAW SD`;

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

  message: async (user, html, text, subject, roles) => {
    const header = `
    <header>
      <div style="font-weight:bold; font-style:italic; font-size:12px">
        Dear ${
          user.name.split(" ")[0]
        }, you are receiving this message because you are in one or more of the following role(s): ${roles.join(
      ", "
    )}
      </div>
    </header>
    <br/>
    `;

    const footer = `
      <br/>
      <hr>
      <footer style="font-size:11px">
        <p>This email (which may contain commercial/marketing/solicitation/advertisement content) was sent as a message 
        from a <a href="https://wish.org/sandiego" target="_blank">Make-A-Wish San Diego</a> administrator 
        to the aforementioned MAW role(s) and is intended for ${user.email}.</p>    
        <p>You can log in to the <a href="${config.app.frontend_url}/login" target="_blank"> 
        Volunteer Hub</a> or reply to this email (MAWVolunteerHub@gmail.com) if any action is needed.</p>
        <p>If you have any questions or general inquiries, you can reach out to us by visiting our 
        <a href="https://wish.org/sandiego/our-chapter" target="_blank">Contact Us page</a> or by replying to this email.</p>
        <p>If you want to stop receiving messaging emails (or all communication from MAW), you can
        email MAWVolunteerHub@gmail.com with your request to delete your account. Alternatively, you can log in
        to the Volunteer Hub and deactivate your account.</p> 
        <br/>
        <p style="color:black">Make-A-Wish San Diego <br/>4995 Murphy Canyon Rd. <br/>Suite 402 <br/>San Diego, CA 92123 </p>
      </footer>`;

    const full_html = header + html + footer;

    const intro = "Message from Make-A-Wish: ";
    const full_subject = intro + subject;

    const data = {
      to: user.email,
      subject: full_subject,
      html: full_html,
      text,
    };

    const res = await transporter.sendMail(data);

    return res;
  },
};
