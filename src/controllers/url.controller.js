// This file will contain the controller functions for handling URL-related requests. 

const Url = require("../models/url.model.js");
const validUrl = require("valid-url");

exports.create = (req, res) => {
    if (!req.body.url) {
        return res.status(400).send({
            message: "URL can not be empty!",
        });
    }

    if (!validUrl.isUri(req.body.url)) {
        return res.status(400).send({
            message: "Invalid URL",
        });
    }

    const url = new Url({
        original_url: req.body.url,
    });

    Url.create(url, (err, data) => {
        if (err)
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Short URL.",
            });
        
        const response = {
            id: data.id,
            url: data.original_url,
            shortCode: data.short_code,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        res.status(201).send(response);
    });
};

exports.findOne = (req, res) => {
    Url.findByShortCode(req.params.shortCode, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Url with shortCode ${req.params.shortCode}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Url with shortCode " + req.params.shortCode
                });
            }
        } else {
            const response = {
                id: data.id,
                url: data.original_url,
                shortCode: data.short_code,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };
            res.send(response);
        }
    });
};

exports.redirectToOriginalUrl = (req, res) => {
    Url.findByShortCode(req.params.shortCode, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found Url with shortCode ${req.params.shortCode}.`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving Url with shortCode " + req.params.shortCode
                });
            }
        }

        Url.incrementAccessCount(data.short_code, (err, result) => {
            if (err) {
                console.log(`Could not increment access count for ${data.short_code}`, err);
            }
            return res.redirect(data.original_url);
        });
    });
}; 