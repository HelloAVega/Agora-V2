const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL || '';

let sequelize;
if (connectionString) {
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
  });
} else {
  // Fallback to in-memory sqlite for local dev when DATABASE_URL not provided
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
}

module.exports = sequelize;
