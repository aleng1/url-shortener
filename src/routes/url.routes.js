module.exports = app => {
    const urls = require("../controllers/url.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Short URL
    router.post("/", urls.create);
  
    app.use('/shorten', router);
}; 