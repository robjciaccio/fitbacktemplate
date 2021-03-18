const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')

const usersController = require('../controllers/users_controller')

const usersRouter = express.Router()

usersRouter.get('/', usersController.getUsers)

module.exports = usersRouter
