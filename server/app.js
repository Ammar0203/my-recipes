require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const db = require('./models/database')
const models = require('./models')
const router = require('./routes')
const path = require('path')

const port = process.env.PORT || 5000

const app = express()

// create public/uploads folder if it does not exist
var fs = require('fs');
var dir = './public/images';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router)

db.sync({alter: true}).then(() => {
  app.listen(port, () => {
    console.log("Server started on port " + port)
  })
})