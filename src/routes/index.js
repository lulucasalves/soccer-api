
const express = require('express')
const teamsService = require('../services/teamsService')

const routes = express.Router()

routes.get('/', teamsService)

module.exports = routes
