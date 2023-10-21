const { vars } = require("../services/vars");

async function getFormations(id, browser, active) {
  if (!active) return { formacaoCasa: null, formacaoFora: null };

  try {
    const page2 = await browser.newPage();

    await page2.goto(
      `https://www.flashscore.com.br/jogo/${id}/#/resumo-de-jogo/equipes`
    );

    await page2.waitForSelector(vars.identificador_formacao);

    const formacoes = await page2.evaluate(async (vars) => {
      const header = document.querySelector(vars.identificador_formacao);
      const headerItens = header.querySelectorAll(vars.formacao_valor);

      const itensArray = [];

      headerItens.forEach((item) => {
        const itemText = item.textContent.trim();
        itensArray.push(itemText);
      });

      return { formacaoCasa: itensArray[0], formacaoFora: itensArray[1] };
    }, vars);

    await page2.close();

    return formacoes;
  } catch {
    return { formacaoCasa: null, formacaoFora: null };
  }
}

module.exports = { getFormations };
