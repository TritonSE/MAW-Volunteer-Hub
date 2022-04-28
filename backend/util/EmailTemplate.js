const MAW_EMAIL = "MAWVolunteerHub@gmail.com";

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

  FeedbackForwardingEmailAddress: MAW_EMAIL,
  FeedbackForwardingEmailAddressIdentityArn:
    "arn:aws:ses:us-west-1:141769618659:identity/MAWVolunteerHub@gmail.com",

  FromEmailAddress: MAW_EMAIL,
  FromEmailAddressIdentityArn:
    "arn:aws:ses:us-west-1:141769618659:identity/MAWVolunteerHub@gmail.com",
  ReplytToAddresses: [MAW_EMAIL],
};

module.exports = {
  EmailTemplate,
};
