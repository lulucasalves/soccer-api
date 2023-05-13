const express = require("express");
const teamsService = require("../services/teamsService");
const teamsResult = require("../services/teamsResult");

const routes = express.Router();

routes.get("/", teamsService);
routes.get("/results", teamsResult);

module.exports = routes;
