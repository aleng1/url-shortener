const sql = require('./db.js');
const { nanoid } = require("nanoid");

const Url = function(url) {
    this.original_url = url.original_url;
    this.short_code = url.short_code || nanoid(7);
};

Url.create = (newUrl, result) => {
    sql.query("INSERT INTO urls SET ?", newUrl, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created url: ", { id: res.insertId, ...newUrl });
        result(null, { id: res.insertId, ...newUrl });
    });
};

Url.findByShortCode = (shortCode, result) => {
    sql.query(`SELECT * FROM urls WHERE short_code = ?`, shortCode, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found url: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Url.updateByShortCode = (shortCode, url, result) => {
    sql.query(
        "UPDATE urls SET original_url = ? WHERE short_code = ?",
        [url.original_url, shortCode],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated url with short_code: ", shortCode);
            result(null, { short_code: shortCode, ...url });
        }
    );
};

Url.remove = (shortCode, result) => {
    sql.query("DELETE FROM urls WHERE short_code = ?", shortCode, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted url with short_code: ", shortCode);
        result(null, res);
    });
};

Url.incrementAccessCount = (shortCode, result) => {
    sql.query(
        "UPDATE urls SET access_count = access_count + 1 WHERE short_code = ?",
        shortCode,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, res);
        }
    );
};

module.exports = Url; 