const app = require("./infra/app");
const { professionalApi } = require("./services/professionalApi");
require("dotenv/config");

const port = process.env.PORT || 5000;
(async () => await professionalApi())();
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
