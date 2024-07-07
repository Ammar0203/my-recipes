const models = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.regitser = async (req, res) => {
  const {name, email, password} = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const findEmail = await models.User.findOne({where: {email}})
    if(findEmail === null) {
      const user = await models.User.create({name, email, password: hashedPassword})
      const token = jwt.sign({
        id: user.id,
        email: user.email,
      }, process.env.JWT)
      return res.status(200).json({message: "تم انشاء حسابك بنجاح", accessToken: token})
    }else {
      return res.status(400).json({message: "هذا البريد الاكروني مستخدم مسبقا"})
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

exports.login = async (req, res) => {
  const {email, password} = req.body 
  try {
    const user = await models.User.findOne({where: {email}})
    if(user === null) {
      return res.status(401).json({message: "كلمة المرور او البريد الاكتروني غير صحيح"})
    }else{
      const pass = await bcrypt.compare(password, user.password)
      if(pass){
        const token = jwt.sign({
          id: user.id,
          email: user.email,
        }, process.env.JWT)
        return res.status(200).json({message: "تم تسجيل الدخول بنجاح", accessToken: token})
      }else{
        return res.status(401).json({message: "كلمة المرور او البريد الاكتروني غير صحيح"})
      }
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: {id: req.currentUser.id},
      attributes: {exclude: ['password']}
    })
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
}

exports.uploadUserPhoto = async (req, res) => {
  // const url = req.protocol + '://' + req.get('host')
  // console.log(url)
  try {
    const uploadPhoto = await models.User.update({
      img_uri: /*url + '/public/images/' +*/ req.file.filename
    }, {
      where: { id: req.currentUser.id } 
    })
    return res.status(200).json({message: "تم اضافة الصورة بنجاح"})
  } catch (error) {
    return res.status(500).json(error)
  }
}

exports.updateProfile = async (req, res) => {
  const {name, password} = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const update = await models.User.update(
      {
        name,
        password: hashedPassword
      },
      {
        where: { id: req.currentUser.id }
      }
    )
    return res.status(200).json({message: 'تم تعديل البيانات الشخصية'})
  } catch (error) {
    return res.status(500).json(error)
  }
}