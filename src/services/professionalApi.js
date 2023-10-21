const puppeteer = require("puppeteer");
const { myargs, timeout, userAgent } = require("../utils/configs");
const fs = require("fs");
const { getStatistics } = require("../utils/getStatistics");
const { getFormations } = require("../utils/getFormations");
const { getEvents } = require("../utils/getEvents");
const { nextGames } = require("../utils/nextGames");
const { vars } = require("./vars");

async function professionalApi(req, res) {
  let result = [];

  const browser = await puppeteer.launch({
    headless: false,
    args: myargs,
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(timeout);
  await page.setUserAgent(userAgent);

  console.log("Pegando jogos da próxima rodada");
  const proximosJogos = await nextGames(page);

  await page.goto(
    "https://www.flashscore.com.br/futebol/brasil/serie-a/#/WGqehPkI/table/overall"
  );

  await page.waitForSelector(vars.identificador_tabela_brasileirao);

  console.log("Adicionando todos times do brasileirão série A\n");
  const hrefList = await page.evaluate((vars) => {
    const tableWrapper = document.querySelector(
      vars.identificador_tabela_brasileirao
    );
    const tableCells = tableWrapper.querySelectorAll(
      vars.participante_brasileirao
    );

    // Extrair os hrefs dos elementos e armazená-los em uma lista
    const hrefs = [];
    tableCells.forEach((cell) => {
      const link = cell.querySelector(vars.logo_participante_brasileirao);
      const img = link.querySelector("img");

      if (link) {
        const href = link.getAttribute("href");
        const nome = link.getAttribute("title");
        const logo = img ? img.getAttribute("src") : null;
        if (href) {
          hrefs.push({ href, logo, nome });
        }
      }
    });

    return hrefs;
  }, vars);
  console.log("Todos times do brasileirão série A foram adicionados\n");

  await page.close();

  for (const time of hrefList.splice(0, 1)) {
    let jogos = [];
    let NJogo = 0;
    const page = await browser.newPage();
    const [, _, timeNome] = time.href.split("/");

    console.log(`Adicionando jogos do ${timeNome}\n`);

    await page.goto(`https://www.flashscore.com.br${time.href}resultados`);

    await page.waitForSelector(vars.identificador_resultados_time);

    const idList = await page.evaluate((vars) => {
      const sportName = document.querySelector(
        vars.identificador_resultados_time
      );
      const matchElements = sportName.querySelectorAll(
        vars.partida_resultados_time
      );

      // Extrair os ids dos elementos e armazená-los em uma lista
      const ids = [];
      matchElements.forEach((matchElement) => {
        const id = matchElement.getAttribute("id");
        if (id) {
          ids.push(id.replace("g_1_", ""));
        }
      });

      return ids;
    }, vars);

    page.close();

    console.log(`Todos jogos do ${timeNome} foram adicionados\n`);

    for (const id of idList.splice(0, 1)) {
      const page = await browser.newPage();

      console.log(`Análisando jogo ${id}\n`);

      await page.goto(
        `https://www.flashscore.com.br/jogo/${id}/#/resumo-de-jogo/resumo-de-jogo`
      );

      await page.waitForSelector(vars.analise_de_jogo_identificador);

      const homeParticipant = await page.$eval(
        vars.nome_resumo_participante_casa,
        (element) => element.textContent
      );

      const awayParcipant = await page.$eval(
        vars.nome_resumo_participante_fora,
        (element) => element.textContent
      );

      const homeGame = homeParticipant.includes(time.nome);

      const adversario = homeGame ? awayParcipant : homeParticipant;

      NJogo += 1;

      const resultado = await page.evaluate((vars) => {
        const textElements = document.querySelectorAll(
          vars.analise_resultados_jogo
        );
        const texts = [];

        for (const element of textElements) {
          if (element.textContent !== "-")
            texts.push(parseInt(element.textContent));
        }

        return texts;
      }, vars);

      const menuItems = await page.evaluate(async (vars) => {
        try {
          const header = document.querySelector(vars.filtro_analise_jogo);
          const headerItens = header.querySelectorAll("button");

          const itensArray = [];

          headerItens.forEach((item) => {
            const itemText = item.textContent.trim();
            itensArray.push(itemText);
          });

          return itensArray;
        } catch {
          return [];
        }
      }, vars);

      const { eventosCasa, eventosFora } = await getEvents(page);

      let arbitro = null;

      try {
        arbitro = await page.$eval(
          vars.resumo_arbitro,
          (element) => element.textContent
        );
      } catch {}

      page.close();

      console.log(`Adquirindo estátisticas do jogo ${id}\n`);

      const estatisticas = await getStatistics(
        id,
        browser,
        menuItems.includes("Estatísticas")
      );

      console.log(`Adquirindo formação dos times, jogo ${id} - ${time.nome}\n`);

      const { formacaoCasa, formacaoFora } = await getFormations(
        id,
        browser,
        menuItems.includes("Formações")
      );

      if (jogos.filter((val) => val.casa).length < 10 && homeGame) {
        jogos.push({
          casa: homeGame,
          id,
          jogo: NJogo,
          golsFeitos: resultado[0],
          golsSofridos: resultado[1],
          formacao: formacaoCasa,
          adversario: {
            nome: adversario,
            eventos: eventosFora,
            estatisticas: estatisticas.fora,
            formacao: formacaoFora,
          },
          eventos: eventosCasa,
          estatisticas: estatisticas.casa,
          arbitro,
        });
      } else if (jogos.filter((val) => !val.casa).length < 10 && !homeGame) {
        jogos.push({
          casa: homeGame,
          id,
          jogo: NJogo,
          golsFeitos: resultado[1],
          golsSofridos: resultado[0],
          adversario,
          eventos: eventosFora,
          formacao: formacaoFora,
          adversario: {
            nome: adversario,
            eventos: eventosCasa,
            estatisticas: estatisticas.casa,
            formacao: formacaoCasa,
          },
          estatisticas: estatisticas.fora,
          arbitro,
        });
      }
    }

    result.push({ time: time.nome, logo: time.logo, jogos });
  }

  fs.writeFileSync(
    "dados.json",
    JSON.stringify({ times: result, proximos_jogos: proximosJogos })
  );

  await browser.close();
}

module.exports = { professionalApi };
