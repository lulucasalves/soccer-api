async function getFormations(id, browser, active) {
  if (!active) return { formacaoCasa: null, formacaoFora: null };

  try {
    const page2 = await browser.newPage();

    await page2.goto(
      `https://www.flashscore.com.br/jogo/${id}/#/resumo-de-jogo/equipes`
    );

    await page2.waitForSelector(".lf__header.section__title");

    const formacoes = await page2.evaluate(async () => {
      const header = document.querySelector(".lf__header.section__title");
      const headerItens = header.querySelectorAll(".lf__headerPart");

      const itensArray = [];

      headerItens.forEach((item) => {
        const itemText = item.textContent.trim();
        itensArray.push(itemText);
      });

      return { formacaoCasa: itensArray[0], formacaoFora: itensArray[1] };
    });

    await page2.close();

    return formacoes;
  } catch {
    return { formacaoCasa: null, formacaoFora: null };
  }
}

module.exports = { getFormations };
