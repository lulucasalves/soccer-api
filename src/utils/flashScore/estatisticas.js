const { criarObjetoDinamico } = require("./tools/dynamicObjects");

function estatisticasFS(team, rounds) {
  let estatisticasCasa = null;
  let estatisticasFora = null;
  let estatisticasTotal = null;

  let jogosCasa = 0;
  let jogosFora = 0;
  const { jogos } = team;
  for (const jogo of jogos) {
    if (
      ((jogosCasa < rounds && jogo.casa) ||
        (jogosFora < rounds && !jogo.casa)) &&
      jogo.estatisticas !== undefined
    ) {
      if (jogo.casa) {
        if (estatisticasCasa) {
          for (const stats of [
            {
              ...criarObjetoDinamico(jogo.estatisticas),
              numero_jogos: 1,
            },
          ]) {
            for (const key in stats) {
              if (key in estatisticasCasa) {
                estatisticasCasa[key] += stats[key];
              } else {
                estatisticasCasa[key] = stats[key];
              }
            }
          }
        } else
          estatisticasCasa = {
            ...criarObjetoDinamico(jogo.estatisticas),
            numero_jogos: 1,
          };

        jogosCasa++;
      } else {
        if (estatisticasFora) {
          for (const stats of [
            {
              ...criarObjetoDinamico(jogo.estatisticas),
              numero_jogos: 1,
            },
          ]) {
            for (const key in stats) {
              if (key in estatisticasFora) {
                estatisticasFora[key] += stats[key];
              } else {
                estatisticasFora[key] = stats[key];
              }
            }
          }
        } else
          estatisticasFora = {
            ...criarObjetoDinamico(jogo.estatisticas),
            numero_jogos: 1,
          };
        jogosFora++;
      }
      if (jogo.jogo <= rounds) {
        if (estatisticasTotal) {
          for (const stats of [
            {
              ...criarObjetoDinamico(jogo.estatisticas),
              numero_jogos: 1,
            },
          ]) {
            for (const key in stats) {
              if (key in estatisticasTotal) {
                estatisticasTotal[key] += stats[key];
              } else {
                estatisticasTotal[key] = stats[key];
              }
            }
          }
        } else
          estatisticasTotal = {
            ...criarObjetoDinamico(jogo.estatisticas),
            numero_jogos: 1,
          };
      }
    }
  }

  return {
    casa: estatisticasCasa,
    fora: estatisticasFora,
    total: estatisticasTotal,
  };
}

module.exports = { estatisticasFS };
