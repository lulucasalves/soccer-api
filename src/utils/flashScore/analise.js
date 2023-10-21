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

      const totalFora = estatisticas.total["Chutes fora"] ?? 0;
      const totalBlock = estatisticas.total["Chutes bloqueados"] ?? 0;

      const homeFora = estatisticas.casa["Chutes fora"] ?? 0;
      const homeBlock = estatisticas.casa["Chutes bloqueados"] ?? 0;

      const chutesTotais = totalFora + totalBlock;
      const defesasTotais = estatisticas.total["Defesas do goleiro"] ?? 0;

      const chutesLocal = homeFora + homeBlock;
      const defesasLocal = estatisticas.casa["Defesas do goleiro"] ?? 0;

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
      };
    };

    const fora = () => {
      const estatisticas = jogo.timeFora.estatisticas;
      const gols = jogo.timeFora.gols;

      const golsFeitosTotais = gols.total.golsFeitos;
      const golsFeitosLocal = gols.fora.golsFeitos;

      const golsSofridosTotais = gols.total.golsSofridos;
      const golsSofridosLocal = gols.fora.golsSofridos;

      const totalFora = estatisticas.total["Chutes fora"] ?? 0;
      const totalBlock = estatisticas.total["Chutes bloqueados"] ?? 0;

      console.log(jogo.timeFora);

      const awayFora = estatisticas.fora["Chutes fora"] ?? 0;
      const awayBlock = estatisticas.fora["Chutes bloqueados"] ?? 0;

      const chutesTotais = totalFora + totalBlock;
      const defesasTotais = estatisticas.total["Defesas do goleiro"] ?? 0;

      const chutesLocal = awayFora + awayBlock;
      const defesasLocal = estatisticas.fora["Defesas do goleiro"] ?? 0;

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
      geral: chanceGolFora - chanceGolCasa,
    });
  }

  return analise;
}

module.exports = { analiseFunction };
