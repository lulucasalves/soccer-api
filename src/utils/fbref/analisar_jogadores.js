function removerAcentosEspacos(nome) {
  // Remover acentos
  nome = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Remover espaços
  nome = nome.replace(/\s/g, "");

  return nome.toLowerCase();
}

function analisarJogadores(jogadores, positions, times, orderBy) {
  let players = [];

  for (const times of jogadores) {
    for (const games of times.games) {
      for (const playerListed of games.playerList) {
        let player = {
          gols: 0,
          assistencias: 0,
          minutes: 0,
          penalts: 0,
          chutes: 0,
          amarelo: 0,
          vermelho: 0,
          defesas: 0,
          fouls: 0,
          desarmes: 0,
          crosses: 0,
          time: times.nome,
          ...playerListed,
          player: removerAcentosEspacos(`${playerListed.player}${times.nome}`),
        };

        const existPlayer = players.filter(
          (val) =>
            removerAcentosEspacos(val.player) ===
            removerAcentosEspacos(player.player)
        );
        const notCurrentPlayer = players.filter(
          (val) =>
            removerAcentosEspacos(val.player) !==
            removerAcentosEspacos(player.player)
        );

        if (existPlayer.length) {
          const currentPlayer = existPlayer[0];
          players = [
            ...notCurrentPlayer,
            {
              ...currentPlayer,
              gols: player.gols + currentPlayer.gols,
              assistencias: player.assistencias + currentPlayer.assistencias,
              minutes: player.minutes + currentPlayer.minutes,
              penalts: player.penalts + currentPlayer.penalts,
              chutes: player.chutes + currentPlayer.chutes,
              amarelo: player.amarelo + currentPlayer.amarelo,
              vermelho: player.vermelho + currentPlayer.vermelho,
              defesas: player.defesas + currentPlayer.defesas,
              touches: [player.touches, ...currentPlayer.touches],
              fouls: player.fouls + currentPlayer.fouls,
              desarmes: player.desarmes + currentPlayer.desarmes,
              crosses: player.crosses + currentPlayer.crosses,
              games: currentPlayer.games + 1,
            },
          ];
        } else {
          players.push({
            ...player,
            games: 1,
            touches: [player.touches],
            time: times.nome,
          });
        }
      }
    }
  }

  let playerAnalisis = [];

  for (const player of players) {
    let statistics = {
      ...player,
      gols: player.gols / player.games,
      assistencias: player.assistencias / player.games,
      penalts: player.penalts / player.games,
      chutes: player.chutes / player.games,
      amarelo: player.amarelo / player.games,
      vermelho: player.vermelho / player.games,
      defesas: player.defesas / player.games,
      fouls: player.fouls / player.games,
      desarmes: player.desarmes / player.games,
      crosses: player.crosses / player.games,
      minutes: player.minutes / player.games,
    };

    statistics = {
      ...statistics,
      pontuacao:
        statistics.gols * 0.8 +
        statistics.assistencias * 0.5 +
        statistics.penalts * 0.25 +
        statistics.chutes * 0.1 -
        statistics.amarelo * 0.2 -
        statistics.vermelho * 0.3 +
        statistics.defesas * 0.16 +
        statistics.crosses * 0.01 +
        statistics.minutes * 0.001 +
        statistics.desarmes * 0.15,
    };

    playerAnalisis.push(statistics);
  }

  let mediaGeral = {
    gols: 0,
    assistencias: 0,
    penalts: 0,
    chutes: 0,
    amarelo: 0,
    vermelho: 0,
    defesas: 0,
    fouls: 0,
    desarmes: 0,
    crosses: 0,
    pontuacao: 0,
  };

  for (const key of Object.keys(mediaGeral)) {
    for (const player of playerAnalisis) {
      if (player[key]) {
        mediaGeral = {
          ...mediaGeral,
          [key]: mediaGeral[key] + player[key],
        };
      }
    }
  }

  for (const key of Object.keys(mediaGeral)) {
    mediaGeral = {
      ...mediaGeral,
      [key]:
        mediaGeral[key] /
        playerAnalisis.filter((value) => !value.defesas).length,
    };
  }

  return {
    playerAnalisis: playerAnalisis
      .sort((a, b) => a[orderBy] - b[orderBy])
      .filter((val) => (times.length ? times.includes(val.time) : val))
      .filter((val) =>
        positions.length ? positions.includes(val.position) : val
      ),
    mediaGeral,
  };
}

module.exports = { analisarJogadores };
