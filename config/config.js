require("dotenv").config();

const config = {
  port: process.env.port,
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
};

module.exports = config;
