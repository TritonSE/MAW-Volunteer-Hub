const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const config = require("../config");

const MAW_EMAIL = "MAWVolunteerHub@gmail.com";

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

module.exports = {
  sendEmailSignup: async (user) => {
    const html_data = `
        <div>
            <p>Dear ${user.name.split(" ")[0]},</p>
            <p>Your account has been created. You will be notified when 
            an admin has approved your account and have access to the website.</p>
            <p>Thanks,<br/>MAW SD</p>
        </div>`;

    const text_data = `Dear ${user.name.split(" ")[0]}, \n
            Your account has been created. You will be notified when an admin has approved 
            your account and have access to the website. \nThanks, \nMAW SD`;

    const message = {
      Content: {
        Simple: {
          Body: {
            Html: {
              Data: html_data,
            },
            Text: {
              Data: text_data,
            },
          },
          Subject: {
            Data: "Thank you for joining Make-A-Wish San Diego!",
          },
        },
      },

      Destination: {
        ToAddresses: [user.email],
      },

      FeedbackForwardingEmailAddress: MAW_EMAIL,
      FeedbackForwardingEmailAddressIdentityArn:
        "arn:aws:ses:us-west-1:141769618659:identity/MAWVolunteerHub@gmail.com",

      FromEmailAddress: MAW_EMAIL,
      FromEmailAddressIdentityArn:
        "arn:aws:ses:us-west-1:141769618659:identity/MAWVolunteerHub@gmail.com",
      ReplytToAddresses: [MAW_EMAIL],
    };

    const command = new SendEmailCommand(message);
    const response = await client.send(command);
    return response;
  },
};
