const { pgJogadores } = require("./tools/pgJogadores");

function analiseFunction(jogos) {
  let analise = [];
  for (const jogo of jogos) {
    const casa = () => {
      const estatisticas = jogo.timeCasa.estatisticas;
      const gols = jogo.timeCasa.gols;

      const golsFeitosTotais = gols.total.golsFeitos;
      const golsFeitosLocal = gols.casa.golsFeitos;

      const golsSofridosTotais = gols.total.golsSofridos;
      const golsSofridosLocal = gols.casa.golsSofridos;

      const totalFora = estatisticas.total["Chutes no Gol"] ?? 0;
      const totalBlock = estatisticas.total["Chutes Bloqueados"] ?? 0;

      const homeFora = estatisticas.casa["Chutes no Gol"] ?? 0;
      const homeBlock = estatisticas.casa["Chutes Bloqueados"] ?? 0;

      const chutesTotais = totalFora + totalBlock;
      const defesasTotais = estatisticas.total["Defesas do Goleiro"] ?? 0;

      const chutesLocal = homeFora + homeBlock;
      const defesasLocal = estatisticas.casa["Defesas do Goleiro"] ?? 0;

      const participacoes = pgJogadores(jogo.timeCasa.events.total);

      return {
        time: jogo.timeCasa.time,
        chutesLocal,
        chutesTotais,
        defesasTotais,
        defesasLocal,
        golsSofridosLocal,
        golsSofridosTotais,
        golsFeitosTotais,
        golsFeitosLocal,
        participacoes,
      };
    };

    const fora = () => {
      const estatisticas = jogo.timeFora.estatisticas;
      const gols = jogo.timeFora.gols;

      const golsFeitosTotais = gols.total.golsFeitos;
      const golsFeitosLocal = gols.fora.golsFeitos;

      const golsSofridosTotais = gols.total.golsSofridos;
      const golsSofridosLocal = gols.fora.golsSofridos;

      const totalFora = estatisticas.total["Chutes no Gol"] ?? 0;
      const totalBlock = estatisticas.total["Chutes Bloqueados"] ?? 0;

      const awayFora = estatisticas.fora["Chutes no Gol"] ?? 0;
      const awayBlock = estatisticas.fora["Chutes Bloqueados"] ?? 0;

      const chutesTotais = totalFora + totalBlock;
      const defesasTotais = estatisticas.total["Defesas do Goleiro"] ?? 0;

      const chutesLocal = awayFora + awayBlock;
      const defesasLocal = estatisticas.fora["Defesas do Goleiro"] ?? 0;

      const participacoes = pgJogadores(jogo.timeFora.events.total);

      return {
        time: jogo.timeFora.time,
        chutesLocal,
        chutesTotais,
        defesasTotais,
        defesasLocal,
        golsSofridosLocal,
        golsSofridosTotais,
        golsFeitosTotais,
        golsFeitosLocal,
        participacoes,
      };
    };

    const chanceGolFora =
      ((fora().golsFeitosLocal + fora().golsFeitosTotais) / 2 +
        (casa().golsSofridosLocal + casa().golsSofridosTotais) / 2) /
      2;

    const chanceGolCasa =
      ((casa().golsFeitosLocal + casa().golsFeitosTotais) / 2 +
        (fora().golsSofridosLocal + fora().golsSofridosTotais) / 2) /
      2;

    const chanceDefesasCasa = (casa().defesasLocal + casa().defesasTotais) / 2;

    const chanceDefesasFora = (fora().defesasLocal + fora().defesasTotais) / 2;

    analise.push({
      casa: casa(),
      fora: fora(),
      chanceGolFora,
      chanceGolCasa,
      chanceDefesasCasa,
      chanceDefesasFora,
      arbitro: jogo.arbitro,
    });
  }

  return analise;
}

module.exports = { analiseFunction };
