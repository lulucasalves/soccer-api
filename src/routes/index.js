const express = require("express");
const teamsService = require("../services/teamsService");
const teamsResult = require("../services/teamsResult");
const axios = require("axios");
const { playersCartola } = require("../services/cartolaAnal");
const { professionalApi } = require("../services/professionalApi");

const routes = express.Router();

routes.get("/old", teamsService);
routes.get("/results", teamsResult);
routes.get("/cartola", playersCartola);
routes.get("/", professionalApi);

module.exports = routes;
