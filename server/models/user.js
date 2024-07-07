const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database')

const User = db.define('User', {
  name: {
    type: Sequelize.DataTypes.STRING
  },
  email: {
    type: Sequelize.DataTypes.STRING
  },
  password: {
    type: Sequelize.DataTypes.STRING
  },
  img_uri: {
    type: Sequelize.DataTypes.STRING
  }
}, {
  timestamps: false
});

User.associate = models => {
  User.hasMany(models.Post)
  User.hasMany(models.Comment)
}

module.exports = User