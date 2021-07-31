const express = require('express')
const router = express.Router()

const services = require('../services/render')

router.get('/', services.homeRoute)

router.get('/add-user', services.addRoute)

router.get('/update-user', services.updateRoute)

const controllers = require('../controllers/handler')

router.post('/add', controllers.createNewUser)

router.get('/users', controllers.findExistingUsers)

router.put('/edit/:id', controllers.editExistingUser)

router.delete('/remove/:id', controllers.deleteExistingUser)

module.exports = router