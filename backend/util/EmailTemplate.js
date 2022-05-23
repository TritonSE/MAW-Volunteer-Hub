const config = require("../config");

const EmailTemplate = {
  Content: {
    Simple: {
      Body: {
        Html: {
          Data: "",
        },
        Text: {
          Data: "",
        },
      },
      Subject: {
        Data: "",
      },
    },
  },

  Destination: {
    ToAddresses: [],
  },

  FeedbackForwardingEmailAddress: config.amazon_ses.email,
  FeedbackForwardingEmailAddressIdentityArn: config.amazon_ses.emailid_arn,

  FromEmailAddress: `Make-A-Wish (MAW) San Diego <${config.amazon_ses.email}>`,
  FromEmailAddressIdentityArn: config.amazon_ses.emailid_arn,

  ListManagementOptions: {
    ContactListName: config.amazon_ses.contact_list,
  },

  ReplyToAddresses: [config.amazon_ses.email],
};

module.exports = {
  EmailTemplate,
};
