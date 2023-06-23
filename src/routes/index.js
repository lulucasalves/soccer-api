const express = require("express");
const teamsService = require("../services/teamsService");
const teamsResult = require("../services/teamsResult");

const routes = express.Router();

routes.get("/", teamsService);
routes.get("/results", teamsResult);
routes.get("/forex", async (req, res) => {
  const coins = [
    "USD-EUR",
    "USD-JPY",
    "USD-GBP",
    "USD-AUD",
    "USD-CAD",
    "USD-CHF",
    "USD-NZD",
    "EUR-USD",
    "EUR-JPY",
    "EUR-GBP",
    "EUR-AUD",
    "EUR-CAD",
    "EUR-CHF",
    "EUR-NZD",
    "JPY-USD",
    "JPY-EUR",
    "JPY-GBP",
    "JPY-AUD",
    "JPY-CAD",
    "JPY-CHF",
    "JPY-NZD",
    "GBP-USD",
    "GBP-EUR",
    "GBP-JPY",
    "GBP-AUD",
    "GBP-CAD",
    "GBP-CHF",
    "GBP-NZD",
    "AUD-USD",
    "AUD-EUR",
    "AUD-JPY",
    "AUD-GBP",
    "AUD-CAD",
    "AUD-CHF",
    "AUD-NZD",
  ];
  let results = [];

  for (let coin = 0; coin < coins.length; coin++) {
    try {
      const result = await fetch(
        `https://economia.awesomeapi.com.br/json/daily/${coins[coin]}/200`
      ).then((res) => res.json());

      const data = result.slice(0, 100);

      let red = 0;
      let green = 0;
      let last10 = [];

      for (let i = 0; i < result.length; i++) {
        if (data[i]) {
          const type =
            Number(data[i].pctChange) > 0
              ? "green"
              : Number(data[i].pctChange) < 0
              ? "red"
              : "none";

          if (i > 90) last10.push(type);

          if (type === "green") green++;
          else if (type === "red") red++;
        }
      }

      console.log(coins[coin]);

      results.push({
        coin: coins[coin],
        green,
        red,
        last10,
      });
    } catch {
      // console.log("err");
    }
  }

  res.json({
    results: results.filter((val) => {
      if (val.red > 60 || val.green > 60) return val;
    }),
  });
});

module.exports = routes;
