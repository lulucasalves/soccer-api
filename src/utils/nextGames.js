const { vars } = require("../services/vars");

async function nextGames(page) {
  await page.goto(
    "https://www.flashscore.com.br/futebol/brasil/serie-a/calendario"
  );

  await page.waitForSelector(vars.identificador_do_calendario);

  const allTeams = await page.evaluate((vars) => {
    let round = false;
    const tableCells = document.querySelectorAll(
      vars.celula_calendario_partida
    );
    let ids = [];
    let teams = [];
    tableCells.forEach((row) => {
      if (!round) {
        const id = row.getAttribute("id");
        const teamHome = row.querySelector(vars.time_de_casa_calendario);
        const teamAway = row.querySelector(vars.time_de_fora_calendario);

        if (
          !teams.includes(teamHome.innerHTML) &&
          !teams.includes(teamAway.innerHTML)
        ) {
          teams.push(teamHome.innerHTML);
          teams.push(teamAway.innerHTML);
          ids.push(id);
        } else {
          round = true;
        }
      }
    });

    return ids;
  }, vars);

  let teams = [];

  for (const id of allTeams.map((val) => {
    const [, splited] = val.split("g_1_");
    return splited;
  })) {
    await page.goto(
      `https://www.flashscore.com.br/jogo/${id}/#/resumo-de-jogo`
    );

    await page.waitForSelector(vars.resumo_pre_jogo_identificador);

    const casa = await page.$eval(
      vars.nome_resumo_participante_casa,
      (element) => element.textContent
    );

    const fora = await page.$eval(
      vars.nome_resumo_participante_fora,
      (element) => element.textContent
    );

    let arbitro = null;
    let estadio = null;

    try {
      arbitro = await page.$eval(
        vars.resumo_arbitro,
        (element) => element.textContent
      );
      estadio = await page.$eval(
        vars.resumo_estadio,
        (element) => element.textContent
      );
    } catch {}

    teams.push({
      casa,
      fora,
      arbitro,
      estadio,
    });
  }

  return teams;
}

module.exports = { nextGames };
