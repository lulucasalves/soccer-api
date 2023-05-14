const puppeteer = require("puppeteer");
const results = require("../../lastresult.json");

async function teamsResult(_, res) {
  const times = results.times;
  const jogos = results.proximos_jogos;

  let arraySgGeneral = [];

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    let totalforasofrido = 0;
    let totalforafeito = 0;
    let chutesaogolfora = 0;
    let chutesaogolcasa = 0;

    time.fora.gols_sofridos
      .slice(0, 5)
      .forEach((res) => (totalforasofrido += parseInt(res.value)));

    time.fora.chutes_ao_gol
      .slice(0, 5)
      .forEach((res) => (chutesaogolfora += parseInt(res.value)));

    time.casa.chutes_ao_gol
      .slice(0, 5)
      .forEach((res) => (chutesaogolcasa += parseInt(res.value)));

    time.fora.gols_feitos
      .slice(0, 5)
      .forEach((res) => (totalforafeito += parseInt(res.value)));

    let totalcasasofrido = 0;
    let totalcasafeito = 0;

    time.casa.gols_sofridos
      .slice(0, 5)
      .forEach((res) => (totalcasasofrido += parseInt(res.value)));

    time.casa.gols_feitos
      .slice(0, 5)
      .forEach((res) => (totalcasafeito += parseInt(res.value)));

    arraySgGeneral.push({
      clube: time.clube,
      fora: {
        gols_sofridos: totalforasofrido,
        gols_feitos: totalforafeito,
        sgGeral: totalforafeito - totalforasofrido,
        chutesaogol: chutesaogolfora,
      },
      casa: {
        gols_sofridos: totalcasasofrido,
        gols_feitos: totalcasafeito,
        sgGeral: totalcasafeito - totalcasasofrido,
        chutesaogol: chutesaogolcasa,
      },
    });
  }

  res.json(arraySgGeneral);
}

module.exports = teamsResult;
