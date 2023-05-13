const puppeteer = require("puppeteer");
const results = require("../../lastresult.json");

async function teamsResult(_, res) {
  const times = results.times;
  const jogos = results.jogos;

  let arraySgGeneral = [];
  const emcasa = ''

  for (let i = 0; i < times.length; i++) {
    const time= times[i]
    const golssofridos = time.
  }
}

module.exports = teamsResult;
