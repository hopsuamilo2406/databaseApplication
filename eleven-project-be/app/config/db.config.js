module.exports = {
  HOST: process.env.MYSQL_HOST,
  USER: process.env.MYSQL_USERNAME,
  PASSWORD: process.env.MYSQL_PASSWORD,
  PORT: process.env.MYSQL_PORT,
  DB: process.env.MYSQL_DATABASE,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  mongoDBUrl: `mongodb+srv://tuananh131001:${process.env.MONGODB_PASSWORD}@cluster0.q115pub.mongodb.net/?retryWrites=true&w=majority`,
};
