import config from "./config/config.js";
import router from './routes/router.js';
import express, { json } from "express";
import { init as dbInit } from './db/conn.js';
import cors from "cors";
const app = express();
import bodyParser from 'body-parser'
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(json());
app.use(cors(config.corsOptions));

app.use('/',router)

await dbInit()
app.listen(config.server.port, config.server.host, () => {
  console.log(`Example app listening at http://${config.server.host}:${config.server.port}`);
});
