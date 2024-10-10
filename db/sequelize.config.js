const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  dialect: 'postgres',
  pool: {
    min: 1,
    max: 10,
    acquire: 30000,
    idle: 10000,
  },
  migrationStorage: 'sequelize',
  migrationStorageTableName: '_migrations',
  seederStorage: 'sequelize',
  seederStorageTableName: '_seeds',
};
