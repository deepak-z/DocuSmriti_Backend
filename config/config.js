import dotenv from "dotenv"
dotenv.config()

const config = {
  db: {
    port: process.env.postgresPort,
    host: process.env.postgresHost,
    user: process.env.postgresUser,
    password: process.env.postgresPassword,
    database: process.env.postgresDatabase,
  },
  email: {
    service: process.env.emailService,
    from: process.env.emailFrom,
    password: process.env.emailPassword,
  },
  server: {
    host: process.env.host,
    port: process.env.port
  },
  corsOptions: {
    origin: '*',
    credentials: true, 
    optionSuccessStatus: 200,
  }
}

export default config
