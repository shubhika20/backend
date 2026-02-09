const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Call from server");
});

app.listen(3000, () => {
  console.log("Server running successfull");
});
