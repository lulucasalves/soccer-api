function eventsFS(team, rounds) {
  let eventosCasa = [];
  let eventosFora = [];
  let eventosTotal = [];

  let jogosCasa = 0;
  let jogosFora = 0;
  const { jogos } = team;
  for (const jogo of jogos) {
    if (
      ((jogosCasa < rounds && jogo.casa) ||
        (jogosFora < rounds && !jogo.casa)) &&
      jogo.eventos !== undefined
    ) {
      if (jogo.casa) {
        eventosCasa.push(...jogo.eventos);
        jogosCasa++;
      } else {
        eventosFora.push(...jogo.eventos);
        jogosFora++;
      }

      if (jogosCasa + jogosFora <= 5) {
        eventosTotal.push(...jogo.eventos);
      }
    }
  }

  return {
    casa: eventosCasa,
    fora: eventosFora,
    total: eventosTotal,
  };
}

module.exports = { eventsFS };
