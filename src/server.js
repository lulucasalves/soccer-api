const app = require("./infra/app");
const { playersCartola } = require("./services/cartolaAnal");
const { professionalApi } = require("./services/professionalApi");
const teamsService = require("./services/teamsService");
const { transformData } = require("./services/transformData");
const { test } = require("./services/test");
const { verify } = require("./utils/verification");

require("dotenv/config");

const port = process.env.PORT || 5000;
(async () => {
  // await verify();
  // await professionalApi();
  // await playersCartola();
  await transformData(5);

  // await teamsService();
  // await test()
})();
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
