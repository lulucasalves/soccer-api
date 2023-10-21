const { vars } = require("../services/vars");

async function getEvents(page) {
  try {
    await page.waitForSelector(vars.eventos_indentificador);

    const eventosCasa = await page.evaluate((vars) => {
      const sportName = document.querySelector(vars.eventos_indentificador);

      const homeEvents = sportName.querySelectorAll(vars.lista_eventos_casa);

      const events = [];
      homeEvents.forEach((matchElement) => {
        const goal = matchElement.querySelector(vars.evento_gol_casa);
        const cards = matchElement.querySelector(vars.evento_cartao);
        const Var = matchElement.querySelector(vars.evento_gol_anulado);

        if (Var) {
          const player = matchElement.querySelector(vars.evento_assistencia);
          events.push({
            tipo: "gol anulado",
            jogador: player.innerHTML,
          });
        } else if (goal) {
          const player = matchElement.querySelector(
            vars.evento_nome_jogador_envolvido
          ).innerHTML;
          const hasAssist = matchElement.querySelector(vars.evento_assistencia);
          const contra = matchElement.querySelector(
            vars.evento_identificador_gol_contra
          );

          events.push({
            tipo: "gol",
            jogador: player,
            assistencia: hasAssist ? hasAssist.innerHTML : null,
            golContra: contra ? true : null,
          });
        } else if (cards) {
          const yellowCard = matchElement.querySelector(
            vars.evento_identificador_cartao_amarelo
          );
          const cardType = yellowCard ? "Cartão Amarelo" : "Cartão Vermelho";
          const player = matchElement.querySelector(
            vars.evento_nome_jogador_envolvido
          ).innerHTML;
          const incident = matchElement.querySelector(
            vars.evento_identificador_gol_contra
          );

          events.push({
            tipo: cardType,
            jogador: player,
            falta: incident ? incident.innerHTML : null,
          });
        }
      });

      return events;
    }, vars);

    const eventosFora = await page.evaluate((vars) => {
      const sportName = document.querySelector(vars.eventos_indentificador);

      const awayEvents = sportName.querySelectorAll(vars.lista_eventos_fora);

      const events = [];
      awayEvents.forEach((matchElement) => {
        const goal = matchElement.querySelector(vars.evento_gol_fora);
        const cards = matchElement.querySelector(vars.evento_cartao);
        const Var = matchElement.querySelector(vars.evento_gol_anulado);

        if (Var) {
          const player = matchElement.querySelector(vars.evento_assistencia);
          events.push({
            tipo: "gol anulado",
            jogador: player.innerHTML,
          });
        } else if (goal) {
          const player = matchElement.querySelector(
            vars.evento_nome_jogador_envolvido
          ).innerHTML;
          const hasAssist = matchElement.querySelector(vars.evento_assistencia);
          const contra = matchElement.querySelector(
            vars.evento_identificador_gol_contra
          );

          events.push({
            tipo: "gol",
            jogador: player,
            assistencia: hasAssist ? hasAssist.innerHTML : null,
            golContra: contra ? true : null,
          });
        } else if (cards) {
          const yellowCard = matchElement.querySelector(
            vars.evento_identificador_cartao_amarelo
          );
          const cardType = yellowCard ? "Cartão Amarelo" : "Cartão Vermelho";
          const player = matchElement.querySelector(
            vars.evento_nome_jogador_envolvido
          ).innerHTML;
          const incident = matchElement.querySelector(
            vars.evento_identificador_gol_contra
          );

          events.push({
            tipo: cardType,
            jogador: player,
            falta: incident ? incident.innerHTML : null,
          });
        }
      });

      return events;
    }, vars);

    return { eventosCasa, eventosFora };
  } catch {
    return {
      eventosCasa: [],
      eventosFora: [],
    };
  }
}

module.exports = { getEvents };
