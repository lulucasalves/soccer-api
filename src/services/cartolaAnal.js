const axios = require("axios");

async function playersCartola(req, res) {
  const request = await axios.get(
    "https://api.cartola.globo.com/atletas/mercado"
  );
  let numbe = 1;

  let playersComplement = [];
  console.log(
    request.data.atletas.filter(
      (val) => val.status_id === 2 || val.status_id === 7
    ).length
  );
  for (const player of request.data.atletas.filter(
    (val) => val.status_id === 2 || val.status_id === 7
  )) {
    try {
      console.log(numbe);

      let totalPoints = 0;
      const totalPlayer = await axios.get(
        `https://api.gatomestre.globo.com/api/v2/atletas/${player.atleta_id}?a=true`
      );

      for (const rodada of totalPlayer.data.rodadas
        .reverse()
        .filter((val) => val.entrou_em_campo)
        .slice(0, 5)) {
        totalPoints += rodada.pontos.num;
      }

      playersComplement.push({
        ...player,
        pontuacao5: totalPoints / 5,
      });
    } catch (err) {
      playersComplement.push({
        ...player,
        pontuacao5: 0,
      });
    }
    numbe++;
  }

  console.log("aqui");

  res.json({
    ...request.data,
    atletas: [
      ...playersComplement,
      ...request.data.atletas.filter(
        (val) => val.status_id !== 2 && val.status_id !== 7
      ),
    ],
  });
}

module.exports = { playersCartola };
