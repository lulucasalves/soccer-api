async function getEvents(page) {
  try {
    await page.waitForSelector(".smv__verticalSections");

    const eventosCasa = await page.evaluate(() => {
      const sportName = document.querySelector(".smv__verticalSections");

      const homeEvents = sportName.querySelectorAll(
        ".smv__participantRow.smv__homeParticipant"
      );

      const events = [];
      homeEvents.forEach((matchElement) => {
        const goal = matchElement.querySelector(".smv__incidentHomeScore");
        const cards = matchElement.querySelector(".card-ico");
        const Var = matchElement.querySelector(".var");

        if (Var) {
          const player = matchElement.querySelector(".smv__assist a");
          events.push({
            tipo: "gol anulado",
            jogador: player.innerHTML,
          });
        } else if (goal) {
          const player = matchElement.querySelector(
            ".smv__playerName div"
          ).innerHTML;
          const hasAssist = matchElement.querySelector(".smv__assist a");
          const contra = matchElement.querySelector(".smv__subIncident");

          events.push({
            tipo: "gol",
            jogador: player,
            assistencia: hasAssist ? hasAssist.innerHTML : null,
            golContra: contra ? true : null,
          });
        } else if (cards) {
          const yellowCard = matchElement.querySelector(".yellowCard-ico");
          const cardType = yellowCard ? "Cartão Amarelo" : "Cartão Vermelho";
          const player = matchElement.querySelector(
            ".smv__playerName div"
          ).innerHTML;
          const incident = matchElement.querySelector(".smv__subIncident");

          events.push({
            tipo: cardType,
            jogador: player,
            falta: incident ? incident.innerHTML : null,
          });
        }
      });

      return events;
    });

    const eventosFora = await page.evaluate(() => {
      const sportName = document.querySelector(".smv__verticalSections");

      const awayEvents = sportName.querySelectorAll(
        ".smv__participantRow.smv__awayParticipant"
      );

      const events = [];
      awayEvents.forEach((matchElement) => {
        const goal = matchElement.querySelector(".smv__incidentAwayScore");
        const cards = matchElement.querySelector(".card-ico");
        const Var = matchElement.querySelector(".var");

        if (Var) {
          const player = matchElement.querySelector(".smv__assist a");
          events.push({
            tipo: "gol anulado",
            jogador: player.innerHTML,
          });
        } else if (goal) {
          const player = matchElement.querySelector(
            ".smv__playerName div"
          ).innerHTML;
          const hasAssist = matchElement.querySelector(".smv__assist a");
          const contra = matchElement.querySelector(".smv__subIncident");

          events.push({
            tipo: "gol",
            jogador: player,
            assistencia: hasAssist ? hasAssist.innerHTML : null,
            golContra: contra ? true : null,
          });
        } else if (cards) {
          const yellowCard = matchElement.querySelector(".yellowCard-ico");
          const cardType = yellowCard ? "Cartão Amarelo" : "Cartão Vermelho";
          const player = matchElement.querySelector(
            ".smv__playerName div"
          ).innerHTML;
          const incident = matchElement.querySelector(".smv__subIncident");

          events.push({
            tipo: cardType,
            jogador: player,
            falta: incident ? incident.innerHTML : null,
          });
        }
      });

      return events;
    });

    return { eventosCasa, eventosFora };
  } catch {
    return {
      eventosCasa: [],
      eventosFora: [],
    };
  }
}

module.exports = { getEvents };
