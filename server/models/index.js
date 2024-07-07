const Comment = require('./comment')
const db = require('./database')
const Like = require('./like')
const Post = require('./post')
const Post_Image = require('./post_image')
const User = require('./user')

const models = {
  User: User,
  Post: Post,
  Post_Image: Post_Image,
  Comment: Comment,
  Like: Like
}

Object.keys(models).forEach(model => {
  if('associate' in models[model]) {
    models[model].associate(models)
  }
})

module.exports = models