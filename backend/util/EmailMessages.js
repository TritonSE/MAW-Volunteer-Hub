const mawEmail = "MAWVolunteerHub@gmail.com";

const signupHtml = `
<div>
    <p>Your account has been created. You will be notified when 
    an admin has approved your account and have access to the website.</p>
    <p>Thanks,<br/>MAW SD</p>
</div>`;

const accessHtml = `
<div>
    <p>Your account has been approved. You can now access the website at 
    <a href="https://maw-volunteer-hub.herokuapp.com/login" target="_blank"> 
    https://maw-volunteer-hub.herokuapp.com/login</a>.</p>
    <p>Thanks,<br/>MAW SD</p>
</div>`;

const signupMsg = {
  to: "",
  from: mawEmail,
  subject: "Thank you for joining Make-A-Wish San Diego!",
  text: " ",
  html: signupHtml,
};

const accessMsg = {
  to: "",
  from: mawEmail,
  subject: "Your Make-A-Wish San Diego account has been approved!",
  text: " ",
  html: accessHtml,
};

module.exports = {
  signupMsg,
  accessMsg,
};
