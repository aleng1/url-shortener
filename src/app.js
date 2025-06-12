const express = require('express');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('URL Shortener API is running');
});

require("./routes/url.routes.js")(app);

module.exports = app; 