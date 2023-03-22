const config = require("../config/config.js");
const { Client } = require("pg");
console.log(config.db)
const client = new Client({
  port: config.db.port,
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
});

const createDatabase = async () => {
    try {
        await client.connect();                          
        await client.query(`CREATE DATABASE ${config.db.database};`);         
        console.log('Database created');
    } catch (error) {
        //console.log(error);
        console.log('Database already exists');
    } 
};


exports.init = () => {
    createDatabase()
}
