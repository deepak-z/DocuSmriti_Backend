const express = require("express");

const app = express();
app.use(express.json());

const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
require("dotenv").config();

const db = require('./db/conn.js')
db.init()
const indexRouter = require('./routes/serviceRouter')
const emailRouter = require('./routes/emailRouter')

app.use("/mail", emailRouter);
app.use('/',indexRouter)

app.listen(3333, () => {
  console.log(`Example app listening at http://localhost:3333`);
});
