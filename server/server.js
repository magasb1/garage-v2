const express = require("express");
const morgan = require('morgan')
const apiRoutes = require("./routes/api")

const app = express();

app.use(morgan('combined'))
app.use("/api", apiRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
