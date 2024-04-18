const app = require("./infra/app");
const { playersCartola } = require("./services/cartolaAnal");
const { professionalApi } = require("./services/professionalApi");
const { players } = require("./utils/fbref/players");
const teamsService = require("./services/teamsService");
const { transformData } = require("./services/transformData");
const { test } = require("./services/test");
const { verify } = require("./utils/verification");

require("dotenv/config");
/*
"agustincanobbio",
  "julimar",
  "pablo",
  "tomascuello",
  "pedro",
  "evertonsoares",
  "luizaraujo",
  "paulinho",
  "hulk",
  "juanmartinlucero",
  "marinho",
  "tiquinhosoares",
  "luizhenrique",
  "juniorsantos",
  */
/*
   "nicolasdelacruz",
  "fernandinho",
  "erick",
  "danilobarbosa",
  "tomaspochettino",
  "tchetche",
  "yagopikachu",
  "josewelison",
  "otavio",
  "erickpulgar",
  "alanfranco",
  "hercules",
  */

/*
  "leonardogodoy",
  "lucasesquivel",
  "guilhermearana",
  "mateoponte",
  "hugo",
  "ayrtonlucas",
  "guillermovarela",
  "brunopacheco",
  "guilhermetinga",
  */

/*
  "jemerson",
  "felixtorrescaicedo",
  "kaiquerocha",
  "gustavohenrique",
  "emanuelbritez",
  "titi",
   */
const jogadores = [];

const port = process.env.PORT || 5000;
(async () => {
  // await verify();
  //await professionalApi();
  //await players(10);
  await transformData(10, jogadores, 'pontuacao');
})();
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
