const puppeteer = require("puppeteer");
const { myargs, timeout, userAgent } = require("../configs");
const fs = require("fs");

async function players(rounds) {
  const browser = await puppeteer.launch({
    headless: true,
    args: myargs,
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(timeout);
  await page.setUserAgent(userAgent);

  await page.goto("https://fbref.com/pt/comps/24/Serie-A-Estatisticas");

  const vars = {
    principalTable: "#switcher_results2024241 tbody",
  };

  await page.waitForSelector(vars.principalTable);

  let hrefList = await page.evaluate((vars) => {
    const tableWrapper = document.querySelector(vars.principalTable);
    const tableCells = tableWrapper.querySelectorAll("tr");

    // Extrair os hrefs dos elementos e armazená-los em uma lista
    const hrefs = [];
    let num = 1;
    tableCells.forEach((cell) => {
      const link = cell.querySelector("a");

      if (link) {
        const href = link.getAttribute("href");
        const nome = link.textContent;
        if (href) {
          hrefs.push({ href, nome, games: [], num });
        }
      }

      num++;
    });

    return hrefs;
  }, vars);

  page.close();

  for (const time of hrefList) {
    const page = await browser.newPage();
    await page.goto(`https://fbref.com${time.href}`);

    await page.waitForSelector("#matchlogs_for tbody");

    const gamesList = await page.evaluate((vars) => {
      const tableWrapper = document.querySelector("#matchlogs_for tbody");
      const tableCells = tableWrapper.querySelectorAll("tr");

      // Extrair os hrefs dos elementos e armazená-los em uma lista
      const list = [];
      tableCells.forEach((cell) => {
        const link = cell.querySelector("th a");
        const isHome = cell.querySelector("td:nth-child(6)");
        const golsFeitos = cell.querySelector("td:nth-child(8)");
        const golsSofridos = cell.querySelector("td:nth-child(9)");

        if (link) {
          const href = link.getAttribute("href");
          const date = link.textContent;
          if (href) {
            list.push({
              href,
              date,
              homeGame: isHome.textContent !== "Visitante",
              golsFeitos: parseInt(golsFeitos.textContent),
              golsSofridos: parseInt(golsSofridos.textContent),
            });
          }
        }
      });

      return list;
    }, vars);

    const listGames = gamesList.reverse();

    for (const game of listGames.slice(0, rounds)) {
      console.log(`analisando jogo https://fbref.com${game.href}`);
      const pageGame = await browser.newPage();
      await pageGame.goto(`https://fbref.com${game.href}`);

      await pageGame.waitForSelector("#events_wrap");

      const idsStatsPlayer = await pageGame.evaluate(() => {
        const elementos = document.querySelectorAll(
          '[id^="all_player_stats_"]'
        );
        const idsArray = Array.from(elementos).map((elemento) => elemento.id);
        return idsArray;
      });
      const idsStatsGoalKeeper = await pageGame.evaluate(() => {
        const elementos = document.querySelectorAll(
          '[id^="all_keeper_stats_"]'
        );
        const idsArray = Array.from(elementos).map((elemento) => elemento.id);
        return idsArray;
      });

      let playerStatsId = idsStatsPlayer[0];
      let keeperStatsId = idsStatsGoalKeeper[0];

      if (!game.homeGame) {
        playerStatsId = idsStatsPlayer[1];
        keeperStatsId = idsStatsGoalKeeper[1];
      }

      const ids = {
        playerStatsId,
        keeperStatsId,
      };

      let existMenus = true;

      try {
        existMenus = await pageGame.$eval(
          `#${ids.playerStatsId} #${ids.playerStatsId.replace(
            "all_",
            "switcher_"
          )}`,
          (element) => element !== null
        );
      } catch (err) {
        existMenus = false;
      }

      let playerList = [];

      if (existMenus) {
        let playerList1 = await pageGame.evaluate((ids) => {
          const tableWrapper = document.querySelector(
            `#${ids.playerStatsId} #${ids.playerStatsId.replace(
              "all_",
              "switcher_"
            )} div:nth-child(2) tbody`
          );
          const tableCells = tableWrapper.querySelectorAll("tr");

          const list = [];
          tableCells.forEach((cell) => {
            const playerCell = cell.querySelector("th");
            const positionCell = cell.querySelector("td:nth-child(4)");
            const minutesCell = cell.querySelector("td:nth-child(6)");
            const golsCell = cell.querySelector("td:nth-child(7)");
            const assistenciasCell = cell.querySelector("td:nth-child(8)");
            const penalts1Cell = cell.querySelector("td:nth-child(9)");
            const penalts2Cell = cell.querySelector("td:nth-child(10)");
            const chutesCell = cell.querySelector("td:nth-child(11)");
            const amareloCell = cell.querySelector("td:nth-child(13)");
            const vermelhoCell = cell.querySelector("td:nth-child(14)");

            const player = playerCell.textContent.replaceAll(" ", "");
            const position = positionCell.textContent;
            const gols = parseInt(golsCell.textContent);
            const minutes = parseInt(minutesCell.textContent);
            const assistencias = parseInt(assistenciasCell.textContent);
            const penalts =
              parseInt(penalts1Cell.textContent) +
              parseInt(penalts2Cell.textContent);
            const chutes = parseInt(chutesCell.textContent);
            const amarelo = parseInt(amareloCell.textContent);
            const vermelho = parseInt(vermelhoCell.textContent);

            list.push({
              player,
              gols,
              position,
              assistencias,
              minutes,
              penalts,
              chutes,
              amarelo,
              vermelho,
            });
          });

          return list;
        }, ids);

        let playerList2 = await pageGame.evaluate((ids) => {
          const tableWrapper = document.querySelector(
            `#${ids.playerStatsId} #${ids.playerStatsId.replace(
              "all_",
              "switcher_"
            )} div:last-child tbody`
          );
          const tableCells = tableWrapper.querySelectorAll("tr");

          const list = [];
          tableCells.forEach((cell) => {
            const playerCell = cell.querySelector("th");
            const foulsCell = cell.querySelector("td:nth-child(10)");
            const crossesCell = cell.querySelector("td:nth-child(13)");
            const desarmesCell = cell.querySelector("td:nth-child(15)");

            const player = playerCell.textContent.replaceAll(" ", "");
            const fouls = parseInt(foulsCell.textContent);
            const desarmes = parseInt(desarmesCell.textContent);
            const crosses = parseInt(crossesCell.textContent);

            list.push({
              player,
              fouls,
              desarmes,
              crosses,
            });
          });

          return list;
        }, ids);

        let playerList3 = await pageGame.evaluate((ids) => {
          const tableWrapper = document.querySelector(
            `#${ids.playerStatsId} #${ids.playerStatsId.replace(
              "all_",
              "switcher_"
            )} div:nth-child(6) tbody`
          );
          const tableCells = tableWrapper.querySelectorAll("tr");

          const list = [];
          tableCells.forEach((cell) => {
            const playerCell = cell.querySelector("th");
            const touchesCell = cell.querySelector("td:nth-child(7)");

            const player = playerCell.textContent.replaceAll(" ", "");
            const touches = parseInt(touchesCell.textContent);

            list.push({
              player,
              touches,
            });
          });

          return list;
        }, ids);

        let keeperList = await pageGame.evaluate((ids) => {
          const tableWrapper = document.querySelector(
            `#${ids.keeperStatsId} div:last-child tbody`
          );
          const tableCells = tableWrapper.querySelectorAll("tr");

          const list = [];
          tableCells.forEach((cell) => {
            const playerCell = cell.querySelector("th");
            const defesasCell = cell.querySelector("td:nth-child(7)");

            const player = playerCell.textContent.replaceAll(" ", "");
            const defesas = parseInt(defesasCell.textContent);

            list.push({
              player,
              defesas,
            });
          });

          return list;
        }, ids);

        playerList = playerList1.map((val) => ({
          ...val,
          defesas: 0,
          touches: 0,
        }));

        for (const status of playerList2) {
          const currentPlayer = playerList.filter(
            (val) => val.player === status.player
          )[0];
          const notCurrentPlayer = playerList.filter(
            (val) => val.player !== status.player
          );

          playerList = [...notCurrentPlayer, { ...currentPlayer, ...status }];
        }

        for (const status of playerList3) {
          const currentPlayer = playerList.filter(
            (val) => val.player === status.player
          )[0];
          const notCurrentPlayer = playerList.filter(
            (val) => val.player !== status.player
          );

          playerList = [...notCurrentPlayer, { ...currentPlayer, ...status }];
        }

        for (const status of keeperList) {
          const currentPlayer = playerList.filter(
            (val) => val.player === status.player
          )[0];
          const notCurrentPlayer = playerList.filter(
            (val) => val.player !== status.player
          );

          playerList = [...notCurrentPlayer, { ...currentPlayer, ...status }];
        }
      } else {
        let playerList1 = await pageGame.evaluate((ids) => {
          const tableWrapper = document.querySelector(
            `#${ids.playerStatsId} div:last-child tbody`
          );
          const tableCells = tableWrapper.querySelectorAll("tr");

          const list = [];
          tableCells.forEach((cell) => {
            const playerCell = cell.querySelector("th");
            const positionCell = cell.querySelector("td:nth-child(4)");
            const minutesCell = cell.querySelector("td:nth-child(6)");
            const golsCell = cell.querySelector("td:nth-child(7)");
            const assistenciasCell = cell.querySelector("td:nth-child(8)");
            const penalts1Cell = cell.querySelector("td:nth-child(9)");
            const penalts2Cell = cell.querySelector("td:nth-child(10)");
            const chutesCell = cell.querySelector("td:nth-child(11)");
            const amareloCell = cell.querySelector("td:nth-child(13)");
            const vermelhoCell = cell.querySelector("td:nth-child(14)");
            const foulsCell = cell.querySelector("td:nth-child(15)");
            const crossesCell = cell.querySelector("td:nth-child(18)");
            const desarmesCell = cell.querySelector("td:nth-child(19)");

            const player = playerCell.textContent.replaceAll(" ", "");
            const gols = parseInt(golsCell.textContent);
            const position = positionCell.textContent;
            const minutes = parseInt(minutesCell.textContent);
            const assistencias = parseInt(assistenciasCell.textContent);
            const penalts =
              parseInt(penalts1Cell.textContent) +
              parseInt(penalts2Cell.textContent);
            const chutes = parseInt(chutesCell.textContent);
            const amarelo = parseInt(amareloCell.textContent);
            const vermelho = parseInt(vermelhoCell.textContent);
            const fouls = parseInt(foulsCell.textContent);
            const desarmes = parseInt(desarmesCell.textContent);
            const crosses = parseInt(crossesCell.textContent);

            list.push({
              player,
              gols,
              assistencias,
              position,
              minutes,
              penalts,
              chutes,
              amarelo,
              vermelho,
              fouls,
              desarmes,
              crosses,
            });
          });

          return list;
        }, ids);

        let keeperList = await pageGame.evaluate((ids) => {
          const tableWrapper = document.querySelector(
            `#${ids.keeperStatsId} div:last-child tbody`
          );
          const tableCells = tableWrapper.querySelectorAll("tr");

          const list = [];
          tableCells.forEach((cell) => {
            const playerCell = cell.querySelector("th");
            const defesasCell = cell.querySelector("td:nth-child(7)");

            const player = playerCell.textContent.replaceAll(" ", "");
            const defesas = parseInt(defesasCell.textContent);

            list.push({
              player,
              defesas,
            });
          });

          return list;
        }, ids);

        playerList = playerList1.map((val) => ({
          ...val,
          defesas: 0,
          touches: 0,
        }));

        for (const status of keeperList) {
          const currentPlayer = playerList.filter(
            (val) => val.player === status.player
          )[0];
          const notCurrentPlayer = playerList.filter(
            (val) => val.player !== status.player
          );

          playerList = [...notCurrentPlayer, { ...currentPlayer, ...status }];
        }
      }

      const hrefListCurrent = hrefList.filter(
        (val) => val.nome === time.nome
      )[0];
      const hrefListNotCurrent = hrefList.filter(
        (val) => val.nome !== time.nome
      );

      const gamesListNotCurrent = hrefListCurrent.games.filter(
        (val) => val.date !== game.date
      );

      hrefList = [
        ...hrefListNotCurrent,
        {
          ...hrefListCurrent,
          games: [...gamesListNotCurrent, { ...game, playerList }],
        },
      ].sort((a, b) => a.num - b.num);

      pageGame.close();
    }

    page.close();
  }

  fs.writeFileSync("jogadores.json", JSON.stringify(hrefList));

  console.log("finalizado!!!");
  await browser.close();
}

module.exports = { players };
