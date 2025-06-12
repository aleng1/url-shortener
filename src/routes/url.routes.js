module.exports = app => {
    const urls = require("../controllers/url.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Short URL
    router.post("/", urls.create);
  
    // Retrieve a single Short URL with shortCode
    router.get("/:shortCode", urls.findOne);
  
    app.use('/shorten', router);

    // Redirect route
    app.get('/:shortCode', urls.redirectToOriginalUrl);
}; 