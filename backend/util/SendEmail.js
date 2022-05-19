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
  sendEmailMessage: async (users, html, subject, roles) => {
    const message = JSON.parse(JSON.stringify(EmailTemplate));

    const header = `
    <header>
      <div style="font-weight:bold; font-style:italic; font-size:12px">
        You are receiving this message because you are in one or more of the following role(s): ${roles.join(
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
        <p>This email (which may contain commercial/marketing/solicitation content) was sent as a message 
        from a <a href="https://wish.org/sandiego" target="_blank">Make-A-Wish San Diego</a> administrator 
        to the afformentioned MAW role(s).</p>    
        <p>You can login to the <a href="https://maw-volunteer-hub.herokuapp.com/login" target="_blank"> 
        Volunteer Hub</a> or reply to this email (MAWVolunteerHub@gmail.com) if any action is needed.</p>
        <p>If you have any questions or general inquiries, you can reach out to us by visiting our 
        <a href="https://wish.org/sandiego/our-chapter" target="_blank">Contact Us page</a> or reply to this email.</p>
        <p>To opt-out of MESSAGING emails, you can Unsubscribe from messaging emails: {Unsubscribe}. 
        If you want to stop recieving all communication or deactivate your account, you can email
        MAWVolunteerHub@gmail.com with your request.</p> 
        <br/>
        <p>Make-A-Wish San Diego <br/>4995 Murphy Canyon Rd. <br/>Suite 402 <br/>San Diego, CA 92123 </p>
      </footer>`;

    const full_html = header + html + footer;

    const intro = "Message from Make-A-Wish: ";
    const full_subject = intro + subject;

    message.Content.Simple.Body.Html.Data = full_html;
    message.Content.Simple.Subject.Data = full_subject;
    message.Destination.ToAddresses = users;
    // message.Destination.BccAddresses = users; // if we want to BCC instead of TO
    // message.Destination.CcAddresses = [config.amazon_ses.email]; // UNCOMMENT WHEN MERGING TO PRODUCTION

    const command = new SendEmailCommand(message);
    const res = await client.send(command);
    return res;
  },
};
