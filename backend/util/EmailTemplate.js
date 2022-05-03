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

  FromEmailAddress: config.amazon_ses.email,
  FromEmailAddressIdentityArn: config.amazon_ses.emailid_arn,
  ReplytToAddresses: [config.amazon_ses.email],
};

module.exports = {
  EmailTemplate,
};
