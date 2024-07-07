const models = require("../models");
const fs = require('fs/promises')

exports.newPost = async (req, res) => {
  const { title, contents, steps, country, region } = req.body;
  console.log(req);
  try {
    const post = await models.Post.create({
      title,
      contents,
      steps,
      country,
      region,
      UserId: req.currentUser.id,
    });
    req.files.map(async function (file) {
      const post_img = await models.Post_Image.create({
        img_uri: file.filename,
        PostId: post.id,
      });
    });
    return res.status(200).json({ message: "تم اضافة المنشور" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const getPosts = await models.Post.findAll({
      include: [
        {
          model: models.User,
          attributes: { exclude: ["password", "email"] },
        },
        {
          model: models.Post_Image,
        },
      ],
    });
    return res.status(200).json(getPosts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await models.Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: models.User,
          attributes: { exclude: ["password", "email"] },
        },
        {
          model: models.Post_Image,
        },
      ],
    });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getMyAllPosts = async (req, res) => {
  try {
    const myPosts = await models.Post.findAll({
      where: { UserId: req.currentUser.id },
      include: [
        {
          model: models.Post_Image,
        },
      ],
    });
    return res.status(200).json(myPosts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getMyPost = async (req, res) => {
  try {
    const myPost = await models.Post.findOne({
      where: { id: req.params.postId, UserId: req.currentUser.id },
      include: [
        {
          model: models.Post_Image,
        },
      ],
    });
    return res.status(200).json(myPost);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateMyPost = async (req, res) => {
  const { title, contents, steps } = req.body;
  try {
    const updatePost = await models.Post.update(
      {
        title,
        contents,
        steps,
      },
      {
        where: {
          id: req.params.postId,
          UserId: req.currentUser.id,
        },
      }
    );
    return res.status(200).json({ message: "تم التعديل على بيانات المنشور" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.deleteMyPost = async (req, res) => {
  const {postId} = req.body;
  try {
    await models.Post_Image.findAll({
      where: { PostId: postId },
    }).then((res) => {
      res.map((img) => {
        console.log("../public/images/" + img.img_uri)
        fs.unlink("public/images/" + img.img_uri, function (err) {
          if (err) throw err;
        });
      });
    });

    await models.Post_Image.destroy({
      where: { PostId: postId },
    });

    await models.Post.destroy({
      where: { id: postId },
    });
    
    await models.Like.destroy({
      where: {PostId: postId}
    })
    
    await models.Comment.destroy({
      where: {PostId: postId}
    })
    
    return res.status(200).json({ message: "تم حذف منشورك" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
