const app = require("./infra/app");
const { playersCartola } = require("./services/cartolaAnal");
const { professionalApi } = require("./services/professionalApi");
const { players } = require("./utils/fbref/players");
const teamsService = require("./services/teamsService");
const { transformData } = require("./services/transformData");
const { test } = require("./services/test");
const { verify } = require("./utils/verification");
const { searchedData } = require("./services/searchedData");
const { analitics2013 } = require("./utils/2013anal/analitics2013");

require("dotenv/config");

const positions = ['LB'];
const times = [];

const port = process.env.PORT || 5000;
(async () => {
  // await verify();
  // await professionalApi();
  // await players(6);
  //await transformData(10, positions, times, "points");
  analitics2013()
})();
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
