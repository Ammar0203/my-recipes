const models = require('../models')

exports.createComment = async (req, res) => {
  const { text } = req.body
  try {
    const comment = await models.Comment.create({
      text,
      UserId: req.currentUser.id,
      PostId: req.params.postId,
    })
    return res.status(200).json({message: 'تم اضافة التعليق'})
  }catch(error){
    return res.status(500).json(error)
  }
}

exports.getComment = async (req, res) => {
  try{
    const comments = await models.Comment.findAll({
      where: {PostId: req.params.postId},
      include: [
        {
          model: models.User,
          attributes: {exclude: ['password', 'email']}
        }
      ]
    })
    return res.status(200).json(comments)
  }catch(error) {
    return res.status(500).json(error)
  }
}
