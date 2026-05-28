const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const MoodEntry = sequelize.define('MoodEntry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  mood: { type: DataTypes.STRING, allowNull: false }, // e.g. 'good','neutral','bad' or numeric
  score: { type: DataTypes.INTEGER, allowNull: true }, // optional numeric score 1-5
  note: { type: DataTypes.TEXT, allowNull: true },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'mood_entries',
  updatedAt: false,
})

module.exports = MoodEntry
