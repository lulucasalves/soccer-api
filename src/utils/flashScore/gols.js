function golsFS(team, rounds) {
  let golsCasa = { golsFeitos: 0, golsSofridos: 0, numero_jogos: 0 };
  let golsFora = { golsFeitos: 0, golsSofridos: 0, numero_jogos: 0 };
  let golsTotal = { golsFeitos: 0, golsSofridos: 0, numero_jogos: 0 };
  let jogosSemSofrer = 0;
  let jogosCasa = 0;
  let jogosFora = 0;
  const { jogos } = team;
  for (const jogo of jogos) {
    if (
      ((jogosCasa < rounds && jogo.casa) ||
        (jogosFora < rounds && !jogo.casa)) &&
      jogo.golsFeitos !== undefined
    ) {
      if (jogo.casa) {
        jogosCasa++;

        golsCasa = {
          golsFeitos: golsCasa.golsFeitos + jogo.golsFeitos,
          golsSofridos: golsCasa.golsSofridos + jogo.golsSofridos,
          numero_jogos: golsCasa.numero_jogos + 1,
        };
      } else {
        jogosFora++;

        golsFora = {
          golsFeitos: golsFora.golsFeitos + jogo.golsFeitos,
          golsSofridos: golsFora.golsSofridos + jogo.golsSofridos,
          numero_jogos: golsFora.numero_jogos + 1,
        };
      }
      if (jogo.jogo <= rounds) {
        golsTotal = {
          golsFeitos: golsTotal.golsFeitos + jogo.golsFeitos,
          golsSofridos: golsTotal.golsSofridos + jogo.golsSofridos,
          numero_jogos: golsTotal.numero_jogos + 1,
        };

        if (jogo.golsSofridos === 0 && jogo.jogo <= 5) {
          jogosSemSofrer++;
        }
      }
    }
  }

  return { casa: golsCasa, fora: golsFora, total: golsTotal, jogosSemSofrer };
}

module.exports = { golsFS };
