const express = require("express");
const config = require("../config/config.js");

const router = express.Router();
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.from,
    pass: config.email.password,
  },
});

router.post("/send", (req, res) => {
  console.log(req.body.receiverEmail);
  console.log(req.body.subject);
  console.log(config.email.from);

  var mailOptions = {
    from: config.email.from,
    to: req.body.receiverEmail,
    subject: req.body.subject,
    html: { path: './email/signatureInvitation.html' },
    text: "BasicText",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully");
    }
  });
});

module.exports = router;
