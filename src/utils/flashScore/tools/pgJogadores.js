function pgJogadores(lista) {
  let jogadores_g = [];
  let jogadores_a = [];

  for (const events of lista) {
    const findPlayers = jogadores_g.filter(
      (val) => val.jogador === events.jogador
    );

    const allPlayers = jogadores_g.filter(
      (val) => val.jogador !== events.jogador
    );

    if (events.tipo === "gol" && !events.golContra) {
      if (!findPlayers.length) {
        jogadores_g.push({ jogador: events.jogador, gol: 1 });
      } else {
        const infos = findPlayers[0];
        jogadores_g = [
          ...allPlayers,
          { jogador: infos.jogador, gol: infos.gol + 1 },
        ];
      }
    }
  }

  for (const events of lista) {
    const findPlayers = jogadores_a.filter(
      (val) => val.jogador === events.assistencia
    );

    const allPlayers = jogadores_a.filter(
      (val) => val.jogador !== events.assistencia
    );

    if (events.tipo === "gol" && events.assistencia) {
      if (!findPlayers.length) {
        jogadores_a.push({ jogador: events.assistencia, assistencia: 1 });
      } else {
        const infos = findPlayers[0];
        jogadores_a = [
          ...allPlayers,
          {
            jogador: infos.jogador,
            assistencia: infos.assistencia + 1,
          },
        ];
      }
    }
  }

  const dadosJogadores = [...jogadores_a, ...jogadores_g];

  const totalParticipacoes = {};

  dadosJogadores.forEach((item) => {
    const jogadorId = item.jogador;

    if (!totalParticipacoes[jogadorId]) {
      totalParticipacoes[jogadorId] = 0;
    }

    if (item.gol) {
      totalParticipacoes[jogadorId] += item.gol;
    }

    if (item.assistencia) {
      totalParticipacoes[jogadorId] += item.assistencia;
    }
  });

  const listaTotais = Object.keys(totalParticipacoes).map((jogadorId) => ({
    jogador: jogadorId,
    totalParticipacoes: totalParticipacoes[jogadorId],
  }));

  return listaTotais;
}

module.exports = { pgJogadores };
