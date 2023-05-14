const puppeteer = require("puppeteer");

async function teamsService(_, res) {
  const myargs = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain",
  ];

  const arrayTimes = [
    { name: "Palmeiras", code: "palmeiras-1693" },
    { name: "Fluminense", code: "fluminense-1666" },
    { name: "Botafogo", code: "botafogo-1792" },
    { name: "Paranaense", code: "paranaense-1862" },
    { name: "Cruzeiro", code: "cruzeiro-1794" },
    { name: "Fortaleza", code: "fortaleza-4831" },
    { name: "São Paulo", code: "sao-paulo-1677" },
    { name: "Atl. Mineiro", code: "atl-mineiro-1683" },
    { name: "Santos", code: "santos-1798" },
    { name: "Grêmio", code: "gremio-1670" },
    { name: "Internacional", code: "internacional-1799" },
    { name: "Flamengo", code: "flamengo-1802" },
    { name: "Bahia", code: "bahia-1795" },
    { name: "Vasco", code: "vasco-1790" },
    { name: "RB Bragantino", code: "rb-bragantino-4734" },
    { name: "Corinthians", code: "corinthians-1649" },
    { name: "Cuiabá", code: "cuiaba-2704" },
    { name: "Goiás", code: "goias-1863" },
    { name: "Coritiba", code: "coritiba-1796" },
    { name: "América MG", code: "america-mg-6618" },
  ];

  function formatedCards(val) {
    if (
      val ===
      "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fyellow-card-light.svg"
    )
      return "Amarelo";

    if (
      val ===
        "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fred-card-light.svg" ||
      val ===
        "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fsecond-yellow-card-light.svg"
    )
      return "Vermelho";
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: myargs,
  });

  let returnedTimes = [];

  const timeout = 90000000;

  for (let num = 0; num < arrayTimes.length; num++) {
    const page = await browser.newPage();
    page.setDefaultTimeout(timeout);

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );

    let yellowCardsHome = [];
    let golsfeitosHome = [];
    let golssofridosHome = [];
    let targetShootsHome = [];
    let targetShootsTotalHome = [];
    let yellowAdversarioHome = [];
    let adversarioTargetShootsHome = [];
    let adversarioTargetShootsTotalHome = [];
    let penaltyInGame = [];

    let yellowCardsAway = [];
    let golsfeitosAway = [];
    let golssofridosAway = [];
    let targetShootsAway = [];
    let targetShootsTotalAway = [];
    let yellowAdversarioAway = [];
    let adversarioTargetShootsAway = [];
    let adversarioTargetShootsTotalAway = [];

    await page.goto(
      `https://onefootball.com/en/team/${arrayTimes[num].code}/results`
    );

    await page.waitForSelector(
      ".match-cards-lists-appender__load-all-button-container .of-button"
    );

    try {
      await page.click(
        ".match-cards-lists-appender__load-all-button-container .of-button"
      );
    } catch (err) {
      console.log(err);
    }

    await page.waitForTimeout(5000);

    const elements = await page.$$(".match-card");

    for (let i = 0; i < 10; i++) {
      const value = await page.evaluate((element) => element.href, elements[i]);

      try {
        const page1 = await browser.newPage();
        page1.setDefaultTimeout(timeout);

        await page1.goto(value);

        const id = i + 1;

        const home = await page1.$eval(
          ".MatchScoreTeam_home__tXAs0 .MatchScoreTeam_name__3KTX8",
          (time, nometime) => {
            if (time.textContent === nometime) return true;

            return false;
          },
          arrayTimes[num].name
        );

        const golshome = await page1.$eval(
          ".MatchScore_scores__5J_7v span:nth-of-type(1)",
          (gol) => gol.textContent
        );

        const golsout = await page1.$eval(
          ".MatchScore_scores__5J_7v span:nth-of-type(3)",
          (gol) => gol.textContent
        );

        if (home) {
          golsfeitosHome.push({
            id,
            value: parseInt(golshome),
          });
          golssofridosHome.push({
            id,
            value: parseInt(golsout),
          });
        } else {
          golsfeitosAway.push({
            id,
            value: parseInt(golsout),
          });
          golssofridosAway.push({
            id,
            value: parseInt(golshome),
          });
        }

        try {
          await page1.click(
            ".MatchEvents_matchEventsToggleButtonContent__Y4SYZ"
          );
        } catch (err) {
          console.log(err);
        }

        await page1.waitForTimeout(1000);

        const dataVar = home
          ? ".MatchStatsEntry_homeValue__8LaFV"
          : ".MatchStatsEntry_awayValue__AHQ0N";

        const targetShootsTotalValues = await page1.$(
          `.MatchStats_list__zQNqj .MatchStatsEntry_container__C3S4C:nth-of-type(2) ${dataVar}`
        );

        const targetShootsValues = await page1.$(
          `.MatchStats_list__zQNqj .MatchStatsEntry_container__C3S4C:nth-of-type(3) ${dataVar}`
        );

        if (targetShootsTotalValues) {
          const targetShootsValue = await page1.evaluate(
            (elementcard) => elementcard.textContent,
            targetShootsTotalValues
          );

          if (home) {
            targetShootsTotalHome.push({
              id,
              value: parseInt(targetShootsValue),
            });
          } else {
            targetShootsTotalAway.push({
              id,
              value: parseInt(targetShootsValue),
            });
          }
        }

        if (targetShootsValues) {
          const targetShootsValue = await page1.evaluate(
            (elementcard) => elementcard.textContent,
            targetShootsValues
          );

          if (home) {
            targetShootsHome.push({
              id,
              value: parseInt(targetShootsValue),
            });
          } else {
            targetShootsAway.push({
              id,
              value: parseInt(targetShootsValue),
            });
          }
        }

        const dataVarA = home
          ? ".MatchStatsEntry_awayValue__AHQ0N"
          : ".MatchStatsEntry_homeValue__8LaFV";

        const targetShootsTotalValuesA = await page1.$(
          `.MatchStats_list__zQNqj .MatchStatsEntry_container__C3S4C:nth-of-type(2) ${dataVarA}`
        );

        const targetShootsValuesA = await page1.$(
          `.MatchStats_list__zQNqj .MatchStatsEntry_container__C3S4C:nth-of-type(3) ${dataVarA}`
        );

        if (targetShootsTotalValuesA) {
          const targetShootsValue = await page1.evaluate(
            (elementcard) => elementcard.textContent,
            targetShootsTotalValuesA
          );

          if (home) {
            adversarioTargetShootsTotalHome.push({
              id,
              value: parseInt(targetShootsValue),
            });
          } else {
            adversarioTargetShootsTotalAway.push({
              id,
              value: parseInt(targetShootsValue),
            });
          }
        }

        if (targetShootsValuesA) {
          const targetShootsValue = await page1.evaluate(
            (elementcard) => elementcard.textContent,
            targetShootsValuesA
          );

          if (home) {
            adversarioTargetShootsHome.push({
              id,
              value: parseInt(targetShootsValue),
            });
          } else {
            adversarioTargetShootsAway.push({
              id,
              value: parseInt(targetShootsValue),
            });
          }
        }

        const elementHanle = await page1.$$(
          `${
            home
              ? ".MatchEvents_matchEventsItemHome__kLs_s"
              : ".MatchEvents_matchEventsItemAway__TDngb"
          } .MatchEvents_matchEventsItemBox__0hk6n`
        );

        for (let a = 0; a < elementHanle.length; a++) {
          const divHandle = await elementHanle[a].$(
            ".ImageWithSets_of-image__img__o1FHK "
          );

          const value = await page1.evaluate(
            (elementcard) => elementcard.src,
            divHandle
          );

          const divHandleName = await elementHanle[a].$(
            ".MatchEventCard_matchEventsText__VQrp_ p"
          );

          const valueName = await page1.evaluate(
            (elementcard) => elementcard.textContent,
            divHandleName
          );

          if (
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fpenalty-light.svg" ||
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fpenalty-missed-light.svg"
          ) {
            penaltyInGame.push({ id, value: valueName });
          }
        }

        const elementCard = await page1.$$(
          `${
            home
              ? ".MatchEvents_matchEventsItemHome__kLs_s"
              : ".MatchEvents_matchEventsItemAway__TDngb"
          } .ImageWithSets_of-image__img__o1FHK`
        );

        const elementCardA = await page1.$$(
          `${
            home
              ? ".MatchEvents_matchEventsItemAway__TDngb"
              : ".MatchEvents_matchEventsItemHome__kLs_s"
          } .ImageWithSets_of-image__img__o1FHK`
        );

        for (let a = 0; a < elementCard.length; a++) {
          const value = await page1.evaluate(
            (elementcard) => elementcard.src,
            elementCard[a]
          );

          if (
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fyellow-card-light.svg" ||
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fsecond-yellow-card-light.svg" ||
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fred-card-light.svg"
          ) {
            if (home) {
              yellowCardsHome.push({ id, value: formatedCards(value) });
            } else {
              yellowCardsAway.push({ id, value: formatedCards(value) });
            }
          }
        }

        for (let a = 0; a < elementCardA.length; a++) {
          const value = await page1.evaluate(
            (elementcard) => elementcard.src,
            elementCardA[a]
          );

          if (
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fyellow-card-light.svg" ||
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fsecond-yellow-card-light.svg" ||
            value ===
              "https://image-service.onefootball.com/transform?w=24&h=24&dpr=2&image=https%253A%252F%252Fimages.onefootball.com%252Fcw%252Ficons%252Fred-card-light.svg"
          ) {
            if (home) {
              yellowAdversarioHome.push({ id, value: formatedCards(value) });
            } else {
              yellowAdversarioAway.push({ id, value: formatedCards(value) });
            }
          }
        }

        await page1.close();
      } catch (error) {
        console.log(error);
      }
    }

    returnedTimes.push({
      clube: arrayTimes[num].name,
      casa: {
        cartoes: yellowCardsHome,
        gols_feitos: golsfeitosHome,
        gols_sofridos: golssofridosHome,
        chutes: targetShootsTotalHome,
        chutes_ao_gol: targetShootsHome,
        adversario: {
          cartoes: yellowAdversarioHome,
          chutes: adversarioTargetShootsTotalHome,
          chutes_ao_gol: adversarioTargetShootsHome,
        },
      },
      fora: {
        cartoes: yellowCardsAway,
        gols_feitos: golsfeitosAway,
        gols_sofridos: golssofridosAway,
        chutes: targetShootsTotalAway,
        chutes_ao_gol: targetShootsAway,
        adversario: {
          cartoes: yellowAdversarioAway,
          chutes: adversarioTargetShootsTotalAway,
          chutes_ao_gol: adversarioTargetShootsAway,
        },
      },
      ultimos_batedores_de_penalti: penaltyInGame,
    });

    await page.close();
  }

  let nextGames = [];

  const page = await browser.newPage();

  await page.goto(
    "https://onefootball.com/pt-br/competicao/brasileirao-serie-a-16/jogos"
  );

  const elements = await page.$$(
    "of-match-cards-list:nth-of-type(1) .simple-match-card__teams-content"
  );

  for (let i = 0; i < elements.length; i++) {
    const divHandle = await elements[i].$(
      ".simple-match-card__team-content:nth-of-type(1) .simple-match-card-team__name"
    );

    const casa = await page.evaluate(
      (elementcard) => elementcard.textContent,
      divHandle
    );

    const divHandle2 = await elements[i].$(
      ".simple-match-card__team-content:nth-of-type(2) .simple-match-card-team__name"
    );

    const fora = await page.evaluate(
      (elementcard) => elementcard.textContent,
      divHandle2
    );

    nextGames.push({ casa, fora });
  }

  await browser.close();

  res.json({ times: returnedTimes, proximos_jogos: nextGames });
}

module.exports = teamsService;
