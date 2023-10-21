const { vars } = require("../services/vars");

async function getStatistics(id, browser, active) {
  if (!active) return { casa: [], fora: [] };

  const page1 = await browser.newPage();

  await page1.goto(
    `https://www.flashscore.com.br/jogo/${id}/#/resumo-de-jogo/estatisticas-de-jogo/0`
  );
  await page1.waitForTimeout(2000);

  await page1.waitForSelector(vars.analise_de_jogo_identificador);

  const estatisticas1 = await page1.evaluate((vars) => {
    const sportName = document.querySelector(
      vars.analise_de_jogo_identificador
    );
    const events = sportName.querySelectorAll(vars.estatistica_cards);

    const statisticsHome = [];
    const statisticsAway = [];

    events.forEach((matchElement) => {
      const object = matchElement.querySelector(vars.estatistica_card_nome);

      if (object) {
        const home = matchElement.querySelector(
          vars.estatistica_card_valor_casa
        );
        const away = matchElement.querySelector(
          vars.estatistica_card_valor_fora
        );

        if (!object.innerHTML.includes("Gols Esperados")) {
          statisticsHome.push({
            [object.innerHTML]: !isNaN(parseInt(home.innerHTML))
              ? parseInt(home.innerHTML)
              : home.innerHTML,
          });
          statisticsAway.push({
            [object.innerHTML]: !isNaN(parseInt(away.innerHTML))
              ? parseInt(away.innerHTML)
              : away.innerHTML,
          });
        }
      }
    });

    return { casa: statisticsHome, fora: statisticsAway };
  }, vars);
  await page1.close();

  return await estatisticas1;
}

module.exports = { getStatistics };
