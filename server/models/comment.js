const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database')

const Comment = db.define('Comment', {
  text: {
    type: Sequelize.DataTypes.STRING
  }
}, {
  timestamps: false
});

Comment.associate = models => {
  Comment.belongsTo(models.Post)
  Comment.belongsTo(models.User)
}

module.exports = Comment