const config = require("../config/config.js");
const { Client } = require("pg");
console.log(config.db)
const client = new Client({
  port: config.db.port,
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

// client.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected");
// });

const createDatabase = async () => {
    try {
        await client.connect();                            // gets connection
        await client.query('CREATE DATABASE my_database'); // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end();                                // closes connection
    }
};

createDatabase().then((result) => {
    if (result) {
        console.log('Database created');
    }
});
