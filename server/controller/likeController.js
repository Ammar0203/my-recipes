const models = require('../models')

exports.like = async (req, res) => {
  try {
    const userLiked = await models.Like.findOne({
      where: {UserId: req.currentUser.id, PostId: req.params.postId}
    })
    if(userLiked){
      await models.Like.destroy({
        where: {UserId: req.currentUser.id, PostId: req.params.postId}
      })
      return res.status(200).json({message: 'تم حذف الاعجاب'})
    }else {
      await models.Like.create({
        UserId: req.currentUser.id,
        PostId: req.params.postId
      })
      return res.status(200).json({message: 'تم اضافة الاعجاب'})
    }
  }catch (error) {
    return res.status(500).json(error)
  }
}

exports.likeCount = async (req, res) => {
  try {
    const likes = await models.Like.findAll({
      where: {PostId: req.params.postId}
    })
    const userLiked = await models.Like.findOne({
      where: {PostId: req.params.postId, UserId: req.currentUser.id}
    })
    return res.status(200).json({
      likes: likes.length,
      userLiked
    })
  }catch(error){
    return res.status(500).json(error)
  }
}
