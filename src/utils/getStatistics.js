async function getStatistics(id, browser, active) {
  if (!active) return { casa: [], fora: [] };

  const page1 = await browser.newPage();

  await page1.goto(
    `https://www.flashscore.com.br/jogo/${id}/#/resumo-de-jogo/estatisticas-de-jogo/0`
  );
  await page1.waitForTimeout(2000);

  await page1.waitForSelector("#detail .section");

  const estatisticas1 = await page1.evaluate(() => {
    const sportName = document.querySelector(".section");
    console.log("achou");

    const events = sportName.querySelectorAll(".stat__row");

    const statisticsHome = [];
    const statisticsAway = [];

    events.forEach((matchElement) => {
      const object = matchElement.querySelector(".stat__categoryName");

      if (object) {
        const home = matchElement.querySelector(".stat__homeValue");
        const away = matchElement.querySelector(".stat__awayValue");

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
  });
  await page1.close();

  return await estatisticas1;
}

module.exports = { getStatistics };
