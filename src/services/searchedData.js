const puppeteer = require("puppeteer");
const { myargs, timeout, userAgent } = require("../utils/configs");
const fs = require("fs");
const { vars } = require("./vars");

async function searchedData(req, res) {
  const browser = await puppeteer.launch({
    headless: false,
    args: myargs,
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(timeout);
  await page.setUserAgent(userAgent);

  let years = [
    2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
    2024,
  ];

  let goals = [];

  for (const year of years) {
    await page.goto(
      `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/${year}`
    );
    await page.waitForSelector(".aside-rodadas .swiper-wrapper");
    console.log(`verificando ano ${year}`);

    const games = await page.evaluate((year) => {
      const tableWrapper = document.querySelector(
        ".aside-rodadas .swiper-wrapper"
      );
      const tableCells = tableWrapper.querySelectorAll("div");

      // Extrair os hrefs dos elementos e armazená-los em uma lista
      const results = [];
      const errors = [];
      let num = 0;

      tableCells.forEach((cell) => {
        const tableCellsMatch = cell.querySelectorAll(".aside-content ul li");

        tableCellsMatch.forEach((val) => {
          try {
            const matchCell = val.querySelector("a strong span");
            const match = matchCell.textContent;
            results.push({ match, year });
          } catch (err) {
            errors.push(num);
          } finally {
            num++;
          }
        });
      });

      return { results, errors };
    }, year);

    goals.push(...games.results);
  }

  fs.writeFileSync("games2013.json", JSON.stringify(goals));

  await browser.close();
}

module.exports = { searchedData };
