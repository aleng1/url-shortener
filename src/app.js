const express = require('express');

const app = express();

app.use(express.json());
app.use(express.static('public'));

require("./routes/url.routes.js")(app);

module.exports = app; 