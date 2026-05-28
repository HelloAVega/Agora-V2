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
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Nuevo chat',
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'chat_sessions',
})

module.exports = ChatSession