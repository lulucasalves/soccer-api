async function nextGames(page) {
  await page.goto(
    "https://www.flashscore.com.br/futebol/brasil/serie-a/calendario"
  );

  await page.waitForSelector(".sportName");

  const allTeams = await page.evaluate(() => {
    let round = false;
    const tableCells = document.querySelectorAll(".event__match");
    let ids = [];
    let teams = [];
    tableCells.forEach((row) => {
      if (!round) {
        const id = row.getAttribute("id");
        const teamHome = row.querySelector(".event__participant--home");
        const teamAway = row.querySelector(".event__participant--away");

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
  });

  let teams = [];

  for (const id of allTeams.map((val) => {
    const [, splited] = val.split("g_1_");
    return splited;
  })) {
    await page.goto(
      `https://www.flashscore.com.br/jogo/${id}/#/resumo-de-jogo`
    );

    await page.waitForSelector(".mi__data");

    const casa = await page.$eval(
      ".duelParticipant__home .participant__participantName",
      (element) => element.textContent
    );

    const fora = await page.$eval(
      ".duelParticipant__away .participant__participantName",
      (element) => element.textContent
    );

    let arbitro = null;
    let estadio = null;

    try {
      arbitro = await page.$eval(
        ".mi__data .mi__item:nth-child(1) .mi__item__val",
        (element) => element.textContent
      );
      estadio = await page.$eval(
        ".mi__data .mi__item:nth-child(2) .mi__item__val",
        (element) => element.textContent
      );
    } catch {}

    const lesionados = await page.evaluate(() => {
      let playersOutHome = [];
      let playerOutAway = [];

      const scratches = document.querySelector(
        ".lf__scratchesGroup .lf__scratches .lf__side:nth-child(1)"
      );
      try {
        const allScratches = scratches.querySelectorAll(
          ".lf__scratchParticipant"
        );

        allScratches.forEach((val) => {
          const jogador = val.querySelector(".lf__participantName div");
          const problem = val.querySelector(".lf__scratchLabel");

          playersOutHome.push({
            jogador: jogador.innerHTML,
            motivo: problem.innerHTML,
          });
        });
      } catch (err) {}

      const scratches2 = document.querySelector(
        ".lf__scratchesGroup .lf__scratches .lf__side:nth-child(2)"
      );
      try {
        const allScratches2 = scratches2.querySelectorAll(
          ".lf__scratchParticipant"
        );

        allScratches2.forEach((val) => {
          const jogador = val.querySelector(".lf__participantName div");
          const problem = val.querySelector(".lf__scratchLabel");

          playerOutAway.push({
            jogador: jogador.innerHTML,
            motivo: problem.innerHTML,
          });
        });
      } catch (err) {}

      return {
        casa: playersOutHome,
        fora: playerOutAway,
      };
    });

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
