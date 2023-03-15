const express = require("express");
const app = express();
app.use(express.json());
const port = 3333;
var nodemailer = require("nodemailer");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
require("dotenv").config();

var transporter = nodemailer.createTransport({
  service: process.env.sendingEmailService,
  auth: {
    user: process.env.sendingEmail,
    pass: process.env.sendingEmailPassword,
  },
});

app.get("/", (req, res) => {
  res.send("Welcom to VDS backend!");
});

app.post("/sendMail", (req, res) => {
  console.log(req.body.receiverEmail);
  console.log(req.body.subject);
  console.log(process.env.sendingEmail);

  var mailOptions = {
    from: process.env.sendingEmail,
    to: req.body.receiverEmail,
    subject: req.body.subject,
    html: req.body.html,
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
