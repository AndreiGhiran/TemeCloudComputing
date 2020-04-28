var express = require('express');
const url = require("url")
const request = require("request");


var app = express();

app.use(express.static('public/pages'));
app.use(express.static('public/stylesheets'));

app.get("/NearbyMedicalUnits", function(req, res) {
    const query = url.parse(req.url, true).query;
    if (query.lon && query.lat) {
        request.get("https://atlas.microsoft.com/search/poi/json?api-version=1.0&query=hospital&subscription-key=QEPJgkNTIidR2fx7goTtJb6gyhubeZJquuaqb-hqsd0&lat=" + query.lat + "&lon=" + query.lon + "&radius=100000", function(error, response, body) {
            res.header({ "Content-Type": "application/json; charset=UTF-8" });
            res.send({ "results": JSON.parse(body).results });
        });
    }
});


module.exports = app;