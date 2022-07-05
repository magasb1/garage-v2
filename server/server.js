const express = require("express");
const morgan = require('morgan')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'))

app.use("/api", require("./routes/api"))

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3001;

app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST + ':' + PORT}`);
});
