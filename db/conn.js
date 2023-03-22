import  config  from "../config/config.js";
import pg from 'pg'
const { Client, Pool } = pg

const createDbClient = new Client({
    port: config.db.port,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
})

const db = new Pool({
    port: config.db.port,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
})

export async function init() {
    await createDatabase()
    await connectDatabase()
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

async function connectDatabase() {
    try {
        await db.connect()
        console.log('Database connected')
    } catch (error) {
        console.error('Error connecting database')
    } 
}

export async function execute(query) {
    try {
        const data = await db.query(query) 
        return data, undefined
    } catch (error) {
        return undefined, error
    } 
}
