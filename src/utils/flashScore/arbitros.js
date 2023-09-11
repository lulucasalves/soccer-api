const { criarObjetoDinamico } = require("./tools/dynamicObjects");

function arbitrosFS(data, rounds) {
  let arbitros = [];
  for (const team of data) {
    const { jogos } = team;
    for (const jogo of jogos) {
      if (jogo.estatisticas !== undefined) {
        const estatisticas = criarObjetoDinamico(jogo.estatisticas);
        const faltas =
          estatisticas.Faltas !== undefined ? estatisticas.Faltas : 0;
        const amarelos =
          estatisticas["Cartões amarelos"] !== undefined
            ? estatisticas["Cartões amarelos"]
            : 0;
        const vermelhos =
          estatisticas["Cartões vermelhos"] !== undefined
            ? estatisticas["Cartões vermelhos"]
            : 0;

        if (
          !arbitros.find(
            (val) => val.nome === jogo.arbitro && val.jogos_apitados === rounds
          )
        ) {
          if (arbitros.find((val) => val.nome === jogo.arbitro)) {
            const arbitrosNotFiltered = arbitros.filter(
              (val) => val.nome !== jogo.arbitro
            );
            const arbitroFiltered = arbitros.filter(
              (val) => val.nome === jogo.arbitro
            )[0];

            arbitros = [
              ...arbitrosNotFiltered,
              {
                ...arbitroFiltered,
                faltas: arbitroFiltered.faltas + faltas,
                amarelos: arbitroFiltered.amarelos + amarelos,
                vermelhos: arbitroFiltered.vermelhos + vermelhos,
                jogos_apitados: arbitroFiltered.jogos_apitados + 1,
              },
            ];
          } else {
            arbitros.push({
              nome: jogo.arbitro,
              faltas,
              amarelos,
              vermelhos,
              jogos_apitados: 1,
            });
          }
        }
      }
    }
  }

  return arbitros.filter((val) => val.faltas > 0);
}

module.exports = { arbitrosFS };
