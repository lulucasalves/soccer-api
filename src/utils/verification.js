const puppeteer = require("puppeteer");
const { myargs, timeout, userAgent } = require("./configs");
const { vars } = require("../services/vars");

async function verify() {
  let result = [];

  const browser = await puppeteer.launch({
    headless: true,
    args: myargs,
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(timeout);
  await page.setUserAgent(userAgent);

  console.log("Testando scrapper");

  let errors = [];

  const urls = [
    {
      url: "https://www.flashscore.com.br/futebol/brasil/serie-a",
      verify: "Brasileirão",
      classes: [
        "identificador_do_calendario",
        "tabela_do_calendario",
        "celula_calendario_partida",
        "time_de_casa_calendario",
        "time_de_fora_calendario",
        "identificador_resultados_time",
        "partida_resultados_time",
        "identificador_tabela_brasileirao",
        "participante_brasileirao",
        "logo_participante_brasileirao",
      ],
    },
    {
      url: "https://www.flashscore.com.br/futebol/brasil/serie-a/calendario/",
      verify: "Brasileirão",
      classes: [
        "identificador_do_calendario",
        "tabela_do_calendario",
        "celula_calendario_partida",
        "time_de_casa_calendario",
        "time_de_fora_calendario",
        "identificador_resultados_time",
        "partida_resultados_time",
      ],
    },
    {
      url: "https://www.flashscore.com.br/equipe/bahia/UeD7XtzM/resultados/",
      verify: "Bahia",
      classes: [
        "identificador_do_calendario",
        "tabela_do_calendario",
        "celula_calendario_partida",
        "time_de_casa_calendario",
        "time_de_fora_calendario",
        "identificador_resultados_time",
        "partida_resultados_time",
        "evento_cartao",
      ],
    },
    {
      url: "https://www.flashscore.com.br/jogo/0x69NH70/#/resumo-de-jogo/resumo-de-jogo",
      verify: "Bahia",
      classes: [
        "resumo_pre_jogo_identificador",
        "nome_resumo_participante_casa",
        "nome_resumo_participante_fora",
        "resumo_arbitro",
        "resumo_estadio",
        "eventos_indentificador",
        "lista_eventos_casa",
        "evento_gol_casa",
        "lista_eventos_fora",
        "evento_gol_fora",
        // "evento_gol_anulado",
        "evento_cartao",
        "evento_assistencia",
        "evento_nome_jogador_envolvido",
        "evento_identificador_gol_contra",
        "evento_identificador_cartao_amarelo",
      ],
    },
    {
      url: "https://www.flashscore.com.br/jogo/0x69NH70/#/resumo-de-jogo/equipes",
      verify: "Bahia",
      classes: [
        "nome_resumo_participante_casa",
        "nome_resumo_participante_fora",
        "analise_de_jogo_identificador",
        "analise_resultados_jogo",
        "filtro_analise_jogo",
        "identificador_formacao",
        "formacao_valor",
      ],
    },
    {
      url: "https://www.flashscore.com.br/jogo/0x69NH70/#/resumo-de-jogo/estatisticas-de-jogo/0",
      verify: "Bahia",
      classes: [
        "nome_resumo_participante_casa",
        "nome_resumo_participante_fora",
        "analise_de_jogo_identificador",
        "analise_resultados_jogo",
        "filtro_analise_jogo",
        "estatistica_cards",
        "estatistica_card_nome",
        "estatistica_card_valor_casa",
        "estatistica_card_valor_fora",
      ],
    },
  ];

  for (const url of urls) {
    try {
      await page.goto(url.url);

      await page.waitForTimeout(5000);

      const title = await page.title();
      if (!title.includes(url.verify)) {
        errors.push(`Página ${url.url} não encontrada`);
      }

      for (const classe of url.classes) {
        const sectionExists = await page.$(vars[classe]);
        if (!sectionExists) {
          //   errors.push(`Classe ${classe} não existe`);
          errors.push(`Erro de classe: ${classe} - ${url.url}`);
          //   errors.push(classe);
        }
      }
    } catch (error) {
      errors.push(`Página ${url.url} não encontrada`);
    } finally {
    }
  }
  await browser.close();

  if (errors.length) {
    console.log(errors);
    throw new Error("Stop");
  } else {
    console.log("Nenhum erro encontrado");
  }
}

module.exports = { verify };
