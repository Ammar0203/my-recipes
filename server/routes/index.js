const express = require('express')
const userController = require('../controller/userController')
const postController = require('../controller/postController')
const { userValidationRules, validate, updateUserValidationRules, postValidationRules } = require('../middlewares/validator')
const isLoggedIn = require('../middlewares/authentication')
const upload = require('../middlewares/upload')
const commentController = require('../controller/commentController')
const likeController = require('../controller/likeController')

const router = express.Router()

// user router

router.post('/account/register', userValidationRules(), validate, userController.regitser)
router.post('/account/login', userController.login)
router.get('/account/profile', isLoggedIn, userController.getProfile)
router.put('/account/profile/upload-photo', upload.single('avatar'), isLoggedIn, userController.uploadUserPhoto)
router.put('/account/profile/update', updateUserValidationRules(), validate, isLoggedIn,  userController.updateProfile)

// post router

router.post('/posts/create', upload.array('postImg', 5), postValidationRules(), validate, isLoggedIn, postController.newPost)
router.get('/posts', isLoggedIn, postController.getAllPosts)
router.get('/posts/:postId', isLoggedIn, postController.getPost)
router.get('/my-posts', isLoggedIn, postController.getMyAllPosts)
router.get('/my-posts/:postId', isLoggedIn, postController.getMyPost)
router.put('/my-posts/:postId/update', isLoggedIn, postValidationRules(), validate, postController.updateMyPost)
router.delete('/my-posts/delete', isLoggedIn, postController.deleteMyPost)

// comment router

router.post('/posts/:postId/create-comment', isLoggedIn, commentController.createComment)
router.get('/posts/:postId/get-comments', isLoggedIn, commentController.getComment)

// like router

router.put('/posts/:postId/like', isLoggedIn, likeController.like)
router.get('/posts/:postId/like-count', isLoggedIn, likeController.likeCount)

module.exports = router