const express = require('express');
const app = express();
app.use(express.json())
const port = 3333;
var nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    service: process.env.sendingEmailService,
    auth: {
      user: process.env.sendingEmail,
      pass: process.env.sendingEmailPassword,
    }
  });

app.post('/sendMail', (req, res) => {

    console.log(req.body.receiverEmail);
    console.log(req.body.subject);
    console.log(process.env.sendingEmail);
    

  var mailOptions = {
    from: process.env.sendingEmail,
    to: req.body.receiverEmail,
    subject: req.body.subject,
    text: 'Flex marta hain saala'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send("Email sent successfully");
    }
  });
  

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});