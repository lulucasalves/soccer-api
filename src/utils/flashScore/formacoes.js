function formacoesFS(team, rounds) {
  let formacoesCasa = [];
  let formacoesFora = [];
  let formacoesTotal = [];

  let jogosCasa = 0;
  let jogosFora = 0;
  const { jogos } = team;
  for (const jogo of jogos) {
    if (
      ((jogosCasa < rounds && jogo.casa) ||
        (jogosFora < rounds && !jogo.casa)) &&
      jogo.formacao !== undefined
    ) {
      if (jogo.casa) {
        if (formacoesCasa.find((val) => val.formacao === jogo.formacao)) {
          const formacoesNotFiltered = formacoesCasa.filter(
            (val) => val.formacao !== jogo.formacao
          );
          const formacaoFiltered = formacoesCasa.filter(
            (val) => val.formacao === jogo.formacao
          )[0];

          formacoesCasa = [
            ...formacoesNotFiltered,
            {
              ...formacaoFiltered,
              golsFeitos: formacaoFiltered.golsFeitos + jogo.golsFeitos,
              golsSofridos: formacaoFiltered.golsSofridos + jogo.golsSofridos,
              numero_jogos: formacaoFiltered.numero_jogos + 1,
            },
          ];
        } else {
          formacoesCasa.push({
            formacao: jogo.formacao,
            golsFeitos: jogo.golsFeitos,
            golsSofridos: jogo.golsSofridos,
            numero_jogos: 1,
          });
        }
        jogosCasa++;
      } else {
        if (formacoesFora.find((val) => val.formacao === jogo.formacao)) {
          const formacoesNotFiltered = formacoesFora.filter(
            (val) => val.formacao !== jogo.formacao
          );
          const formacaoFiltered = formacoesFora.filter(
            (val) => val.formacao === jogo.formacao
          )[0];

          formacoesFora = [
            ...formacoesNotFiltered,
            {
              ...formacaoFiltered,
              golsFeitos: formacaoFiltered.golsFeitos + jogo.golsFeitos,
              golsSofridos: formacaoFiltered.golsSofridos + jogo.golsSofridos,
              numero_jogos: formacaoFiltered.numero_jogos + 1,
            },
          ];
        } else {
          formacoesFora.push({
            formacao: jogo.formacao,
            golsFeitos: jogo.golsFeitos,
            golsSofridos: jogo.golsSofridos,
            numero_jogos: 1,
          });
        }

        jogosFora++;
      }

      if (jogo.jogo <= rounds) {
        if (formacoesTotal.find((val) => val.formacao === jogo.formacao)) {
          const formacoesNotFiltered = formacoesTotal.filter(
            (val) => val.formacao !== jogo.formacao
          );
          const formacaoFiltered = formacoesTotal.filter(
            (val) => val.formacao === jogo.formacao
          )[0];

          formacoesTotal = [
            ...formacoesNotFiltered,
            {
              ...formacaoFiltered,
              golsFeitos: formacaoFiltered.golsFeitos + jogo.golsFeitos,
              golsSofridos: formacaoFiltered.golsSofridos + jogo.golsSofridos,
              numero_jogos: formacaoFiltered.numero_jogos + 1,
            },
          ];
        } else {
          formacoesTotal.push({
            formacao: jogo.formacao,
            golsFeitos: jogo.golsFeitos,
            golsSofridos: jogo.golsSofridos,
            numero_jogos: 1,
          });
        }
      }
    }
  }

  return { casa: formacoesCasa, fora: formacoesFora, total: formacoesTotal };
}

module.exports = { formacoesFS };
