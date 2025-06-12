module.exports = app => {
    const urls = require("../controllers/url.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Short URL
    router.post("/", urls.create);
  
    // Retrieve statistics for a Short URL
    router.get("/:shortCode/stats", urls.getStats);
  
    // Retrieve a single Short URL with shortCode
    router.get("/:shortCode", urls.findOne);
  
    // Update a Short URL with shortCode
    router.put("/:shortCode", urls.update);
  
    // Delete a Short URL with shortCode
    router.delete("/:shortCode", urls.delete);
  
    app.use('/shorten', router);

    // Redirect route
    app.get('/:shortCode', urls.redirectToOriginalUrl);
}; 