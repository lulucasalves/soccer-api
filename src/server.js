const app = require("./infra/app");
const { playersCartola } = require("./services/cartolaAnal");
const { professionalApi } = require("./services/professionalApi");
const teamsService = require("./services/teamsService");
const { transformData } = require("./services/transformData");

require("dotenv/config");

const port = process.env.PORT || 5000;
(async () => {
  // await professionalApi();
  await transformData(5);
  // await playersCartola();

  // await teamsService();
})();
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
