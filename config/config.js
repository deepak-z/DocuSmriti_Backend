import dotenv from "dotenv";
dotenv.config();

const config = {
  db: {
    port:     process.env.postgresPort,
    host:     process.env.postgresHost,
    user:     process.env.postgresUser,
    password: process.env.postgresPassword,
    database: process.env.postgresDatabase,
  },
  email: {
    service:  process.env.emailService,
    from:     process.env.emailFrom,
    password: process.env.emailPassword,
  },
  server: {
    host: process.env.host,
    port: process.env.port,
  },
  corsOptions: {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  },
  blockchain: {
    rpcUrl:                       process.env.rpcUrl,
    alchemyApiKey:                process.env.alchemyApiKey,
    contractAddress:              process.env.contractAddress,
    docuSmritiWalletAddress:      process.env.docuSmritiWalletAddress,
    docuSmritiWalletPrivateKey:   process.env.docuSmritiWalletPrivateKey
  },
  zoop: {
    api_key: process.env.zoopApiKey,
    api_id: process.env.zoopApiId,
  },
};

export default config;
