const { times, proximos_jogos } = require("../../dados.json");
const { analiseFunction } = require("../utils/flashScore/analise");
const { arbitrosFS } = require("../utils/flashScore/arbitros");
const { estatisticasFS } = require("../utils/flashScore/estatisticas");
const { formacoesFS } = require("../utils/flashScore/formacoes");
const { golsFS } = require("../utils/flashScore/gols");
const { proximosjogos } = require("../utils/flashScore/proximos_jogos");
const fs = require("fs");

async function transformData(rounds) {
  let teamResponse = [];
  let arbitros = arbitrosFS(times, 10);

  for (const team of times) {
    const { time, logo } = team;

    let estatisticas = estatisticasFS(team, rounds);
    let gols = golsFS(team, rounds);
    const formacoes = formacoesFS(team, rounds);

    teamResponse.push({ time, logo, gols, formacoes, estatisticas });
  }
  // console.log(response.times[0].estatisticas);
  const proximosJogos = proximosjogos(proximos_jogos, teamResponse, arbitros);
  const response = {
    times: teamResponse,
    arbitros,
    proximos_jogos: proximosJogos,
  };

  analiseFunction(proximosJogos);
  fs.writeFileSync(
    "analise.json",
    JSON.stringify(analiseFunction(proximosJogos))
  );

  fs.writeFileSync("site.json", JSON.stringify(response));
}

module.exports = {
  transformData,
};
