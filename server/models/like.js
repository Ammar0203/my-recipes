const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database')

const Like = db.define('Like', {
  // 
}, {
  timestamps: false
});

Like.associate = models => {
  models.User.belongsToMany(models.Post, {through: 'Like'})
  models.Post.belongsToMany(models.User, {through: 'Like'})
}

module.exports = Like