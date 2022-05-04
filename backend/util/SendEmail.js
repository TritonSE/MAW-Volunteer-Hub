const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const config = require("../config");

const region = config.amazon_ses.region;
const accessKeyId = config.amazon_ses.access_key;
const secretAccessKey = config.amazon_ses.secret_key;

const client = new SESv2Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const { EmailTemplate } = require("./EmailTemplate");

module.exports = {
  sendEmailSignup: async (user) => {
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

    const msgSubject = "Thank you for joining Make-A-Wish San Diego!";

    const message = JSON.parse(JSON.stringify(EmailTemplate));

    message.Content.Simple.Body.Html.Data = msgHtml;
    message.Content.Simple.Body.Text.Data = msgText;
    message.Content.Simple.Subject.Data = msgSubject;
    message.Destination.ToAddresses = [user.email];

    const command = new SendEmailCommand(message);
    const res = await client.send(command);
    return res;
  },

  // Email when user is verified by an admin
  sendEmailVerify: async (user) => {
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

    const message = JSON.parse(JSON.stringify(EmailTemplate));

    message.Content.Simple.Body.Html.Data = msgHtml;
    message.Content.Simple.Body.Text.Data = msgText;
    message.Content.Simple.Subject.Data = msgSubject;
    message.Destination.ToAddresses = [user.email];

    const command = new SendEmailCommand(message);
    const res = await client.send(command);
    return res;
  },
  // Email message in html form when a message is posted
  sendEmailMessage: async (users, html, subject) => {
    const message = JSON.parse(JSON.stringify(EmailTemplate));
    message.Content.Simple.Body.Html.Data = html;
    message.Content.Simple.Subject.Data = subject;
    message.Destination.ToAddresses = users;

    const command = new SendEmailCommand(message);
    const res = await client.send(command);
    return res;
  },
};
