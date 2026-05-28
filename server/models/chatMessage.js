const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chatSessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'chat_messages',
})

module.exports = ChatMessage