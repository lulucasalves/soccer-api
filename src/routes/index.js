const express = require("express");
const teamsService = require("../services/teamsService");
const teamsResult = require("../services/teamsResult");

const routes = express.Router();

routes.get("/", teamsService);
routes.get("/results", teamsResult);
routes.get("/forex", async (req, res) => {
  let results = [];
  const result = await fetch(
    "https://economia.awesomeapi.com.br/json/daily/EUR-USD/101"
  ).then((res) => res.json());

  const data = result.slice(1, 100);

  for (let i = 0; i < data.length; i++) {
    const type =
      Number(data[i].pctChange) > 0
        ? "green"
        : Number(data[i].pctChange) < 0
        ? "red"
        : "none";

    results.push({ type, value: data[i].bid });
  }

  res.json(results);
});

module.exports = routes;
