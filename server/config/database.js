const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL || '';
const sqliteStorage = process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'data', 'agora.sqlite');

let sequelize;
if (connectionString) {
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
  });
} else {
  // Fallback to file-based sqlite for local dev when DATABASE_URL is not provided
  // This keeps data between restarts and works outside Docker/Heroku.
  const dataDir = path.dirname(sqliteStorage);
  fs.mkdirSync(dataDir, { recursive: true });
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStorage,
    logging: false,
  });
}

module.exports = sequelize;
