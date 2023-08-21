const app = require("./infra/app");
// const { professionalApi } = require("./services/professionalApi");
const { transformData } = require("./services/transformData");
require("dotenv/config");

const port = process.env.PORT || 5000;
(async () => await transformData())();
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
