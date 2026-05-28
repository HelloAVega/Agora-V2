const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const ChatSession = sequelize.define('ChatSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Chat con Ágora',
  },
}, {
  tableName: 'chat_sessions',
})

module.exports = ChatSession