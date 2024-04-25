const { times, proximos_jogos } = require("../../dados.json");
const jogadores = require("../../jogadores.json");
const { analiseFunction } = require("../utils/flashScore/analise");
const { arbitrosFS } = require("../utils/flashScore/arbitros");
const { estatisticasFS } = require("../utils/flashScore/estatisticas");
const { eventsFS } = require("../utils/flashScore/events");
const { formacoesFS } = require("../utils/flashScore/formacoes");
const { golsFS } = require("../utils/flashScore/gols");
const { proximosjogos } = require("../utils/flashScore/proximos_jogos");
const { analisarJogadores } = require("../utils/fbref/analisar_jogadores");
const fs = require("fs");

async function transformData(
  rounds,
  positions = [],
  timesPlayers = [],
  orderBy = "desarmes"
) {
  let teamResponse = [];

  let arbitros = arbitrosFS(times, 10);

  for (const team of times) {
    const { time, logo } = team;

    let events = eventsFS(team, rounds);
    let estatisticas = estatisticasFS(team, rounds);
    let gols = golsFS(team, rounds);
    const formacoes = formacoesFS(team, rounds);

    teamResponse.push({ time, logo, gols, formacoes, estatisticas, events });
  }
  const proximosJogos = proximosjogos(proximos_jogos, teamResponse, arbitros);
  const response = {
    times: teamResponse,
    arbitros,
    proximos_jogos: proximosJogos,
  };

  const analiseJogadores = analisarJogadores(
    jogadores,
    positions,
    timesPlayers,
    orderBy
  );

  analiseFunction(proximosJogos);
  fs.writeFileSync(
    "analise.json",
    JSON.stringify(analiseFunction(proximosJogos))
  );
  fs.writeFileSync("analise-jogadores.json", JSON.stringify(analiseJogadores));

  // fs.writeFileSync("site.json", JSON.stringify(response));
}

module.exports = {
  transformData,
};
