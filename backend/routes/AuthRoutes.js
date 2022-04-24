const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

const config = require("../config");
const UserModel = require("../models/UserModel");
const { validate, errorHandler } = require("../util/RouteUtils");

const router = express.Router();

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

async function sendEmail() {
  try {
    const message = {
      Content: {
        Simple: {
          Body: {
            Text: {
              Data: "Hello",
            },
          },

          Subject: {
            Data: "Test",
          },
        },
      },
      Destination: {
        ToAddresses: ["aksarava@ucsd.edu"],
      },
      FromEmailAddress: "MAWVolunteerHub@gmail.com",
      FromEmailAddressIdentityArn:
        "arn:aws:ses:us-west-1:141769618659:identity/MAWVolunteerHub@gmail.com",
    };

    const command = new SendEmailCommand(message);
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

router.post("/signup", (req, res, next) =>
  passport.authenticate("signup", { session: false }, (resp, user) => {
    if ((resp && resp.errors) || !user) {
      res.status(500).json({
        error: resp.errors.email
          ? "Email is already in use."
          : "Failed to sign up, please try again.",
      });
    } else {
      // email sending
      sendEmail();

      res.json({
        success: true,
        user: user.toJSON(),
      });
    }
  })(req, res, next)
);

router.post("/login", validate(["email", "password", "remember"], []), (req, res, next) =>
  passport.authenticate("login", (err, user) => {
    if (err || !user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    if (!user.verified) {
      res.status(401).json({ error: "Account not yet verified." });
      return;
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        errorHandler(res)(error);
        return;
      }

      const token = jwt.sign(
        {
          user: {
            _id: user._id,
            email: user.email,
            admin: user.admin,
          },
        },
        config.auth.jwt_secret
      );

      const cookie_opts = { signed: true };
      if (req.body.remember && req.body.remember !== "undefined") {
        // Fix for odd stringify in Chrome
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        cookie_opts.expires = exp;
      }
      res.cookie("token", token, cookie_opts);
      res.json({ success: true, user: user.toJSON() });
    });
  })(req, res, next)
);

router.post("/signout", (req, res) => {
  res.clearCookie("token", { signed: true });
  res.json({ success: true });
});

router.post("/token", passport.authenticate("jwt", { session: false }), (req, res) => {
  UserModel.findById((req.user ?? {})._id)
    .then((user) => res.json({ user: user.toJSON() }))
    .catch(() => res.status(404).json({ error: "No such user exists." }));
});

module.exports = router;
