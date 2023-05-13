const app = require('./infra/app')
require('dotenv/config')

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`)
})
