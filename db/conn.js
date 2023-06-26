import  config  from "../config/config.js";
import pg from 'pg'
import { exec } from 'child_process'
const { Client } = pg

const createDbClient = new Client({
    port: config.db.port,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
})


export async function init() {
    //await createDatabase()
    await migrate()
}

const createDatabase = async () => {
    try {
        await createDbClient.connect()  
        await createDbClient.query(`CREATE DATABASE ${config.db.database};`)     
        console.log('Database created')
    } catch (error) {
        //console.log(error);
        console.log('Database already exists')
    } finally {
        createDbClient.end()
    }
};


async function migrate(){
    exec('npx prisma migrate dev --name init', (err, info) => {
        console.log("DB migrated");
        console.log(info);
        console.log(err)
    })
}