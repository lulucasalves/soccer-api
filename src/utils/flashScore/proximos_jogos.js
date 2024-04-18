const { calcularMedias, mediaArbitro } = require("./tools/medias");

function proximosjogos(proximos_jogos, times, arbitros) {
  let jogos = [];
  for (const jogo of proximos_jogos) {
    const timeCasa = times.filter((val) => val.time.includes(jogo.casa))[0];
    const timeFora = times.filter((val) => val.time.includes(jogo.fora))[0];

    const arbitroAtual = arbitros.filter(
      (val) =>
        val.nome.toLowerCase().replaceAll(" ", "") ===
        jogo.arbitro.toLowerCase().replaceAll(" ", "")
    )[0];

    const mediaFora = {
      ...timeFora,
      jogosSemSofrer: timeFora.gols.jogosSemSofrer,
      gols: calcularMedias(timeFora.gols),
      estatisticas: calcularMedias(timeFora.estatisticas),
    };

    const mediaCasa = {
      ...timeCasa,
      jogosSemSofrer: timeCasa.gols.jogosSemSofrer,
      gols: calcularMedias(timeCasa.gols),
      estatisticas: calcularMedias(timeCasa.estatisticas),
    };

    const mediaArbitros = mediaArbitro(arbitroAtual);

    jogos.push({
      arbitro: mediaArbitros,
      timeCasa: mediaCasa,
      timeFora: mediaFora,
    });
  }

  return jogos;
}

module.exports = { proximosjogos };
