const url = require('url');
const http = require('http');
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://AndreiG:<password>@tema2db-4tquw.gcp.mongodb.net/test?retryWrites=true&w=majority";
//const req = require("request");


const app = http.createServer((request, response) => {



    //console.log(request.headers);
    const { headers, method, url } = request;

    var coll = url.split("/")[1];
    if (url.split("/")[2] == '')
        type = "colection";
    else
        type = "item";
    //console.log(request.statusMessage);
    //console.log(request.url);
    var good_req = true;
    try {
        var params = url.split("/")[2];
    }
    catch (any) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.write("unsuported request");
        response.end();
        good_req = false;
    }
    if (good_req) {
        switch (type) {
            case "colection":
                console.log("colection request");
                switch (request.method) {
                    case "GET":


                        var exists = false;
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("Movies");
                            dbo.listCollections({ name: coll })
                                .next(function (err, collinfo) {
                                    if (collinfo) {
                                        exists = true;
                                    }

                                    console.log(exists);
                                    if (!exists) {

                                        response.writeHead(404, { "Content-Type": "application/json" });
                                        response.write("Collection does not exists");
                                        response.end();
                                    }
                                    else {

                                        console.log("Get");
                                        MongoClient.connect(uri, function (err, db) {
                                            if (err) throw err;
                                            var dbo = db.db("Movies");
                                            dbo.collection(coll).find({}).toArray(function (err, result) {
                                                if (err) throw err;
                                                console.log(Object.keys(JSON.parse(JSON.stringify(result))).length);
                                                response.writeHead(200, { "Content-Type": "application/json" });
                                                response.write(JSON.stringify(result));
                                                response.end();
                                                db.close();
                                            });
                                        });

                                    }
                                });
                        });


                        break;
                    case "POST":
                        console.log("Post")
                        var exists = false;
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("Movies");
                            dbo.listCollections({ name: coll })
                                .next(function (err, collinfo) {
                                    if (collinfo) {


                                        exists = true;
                                    }

                                    console.log(exists);
                                    if (!exists) {

                                        dbo.createCollection(coll, function (err, res) {
                                            if (err) throw err;
                                            console.log("Collection created!");
                                            db.close();
                                        });
                                        response.writeHead(200, { "Content-Type": "application/json" });
                                        response.write("Collection created");
                                        response.end();
                                        db.close();
                                    }
                                    else {
                                        response.writeHead(409, { "Content-Type": "application/json" });
                                        response.write("Collection already exists");
                                        response.end();
                                    }
                                });
                        });
                        break;
                    case "PUT":
                        console.log("Put")
                        response.writeHead(405, { "Content-Type": "application/json" });
                        response.write("Method Not Allowed");
                        response.end();
                        break;
                    case "DELETE":

                        var exists = false;
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("Movies");
                            dbo.listCollections({ name: coll })
                                .next(function (err, collinfo) {
                                    if (collinfo) {
                                        exists = true;
                                    }

                                    console.log(exists);
                                    if (!exists) {

                                        response.writeHead(404, { "Content-Type": "application/json" });
                                        response.write("Collection does not exists");
                                        response.end();
                                    }
                                    else {

                                        MongoClient.connect(uri, function (err, db) {
                                            if (err) throw err;
                                            var dbo = db.db("Movies");
                                            dbo.collection(coll).drop(function (err, delOK) {
                                                if (err) throw err;
                                                if (delOK) console.log("Collection deleted");
                                                db.close();
                                            });
                                        });
                                        response.writeHead(200, { "Content-Type": "application/json" });
                                        response.write("Collection deleted");
                                        response.end();
                                        db.close();
                                    }
                                });
                        });

                        break;
                    default:
                        response.writeHead(400, { "Content-Type": "application/json" });
                        response.write("method unsuported");
                        response.end();
                }
                break;
            case "item":
                switch (request.method) {
                    case "GET":
                        console.log("Get");
                        var param1 = params.split("&")[0].split("=")[1];
                        console.log(param1)
                        var exists = false;


                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("Movies");
                            var query = { movie_name: param1 };
                            dbo.collection(coll).find(query).toArray(function (err, result) {
                                if (err) throw err;
                                if (Object.keys(JSON.parse(JSON.stringify(result))).length != 0)
                                    exists = true;
                                if (!exists) {
                                    console.log("1 document inserted");
                                    response.writeHead(404, { "Content-Type": "application/json" });
                                    response.write("Movie not found");
                                    response.end();
                                    db.close();
                                }
                                else {
                                    MongoClient.connect(uri, function (err, db) {
                                        if (err) throw err;
                                        var dbo = db.db("Movies");
                                        var query = { movie_name: param1 };
                                        dbo.collection(coll).find(query).toArray(function (err, result) {
                                            if (err) throw err;
                                            console.log(result);
                                            response.writeHead(200, { "Content-Type": "application/json" });
                                            response.write(JSON.stringify(result));
                                            response.end();
                                            db.close();
                                        });
                                    });
                                }
                            });
                        });
                        break;
                    case "POST":
                        console.log("Post")
                        var param1 = params.split("&")[0].split("=")[1];
                        var param2 = params.split("&")[1].split("=")[1];
                        var param3 = params.split("&")[2].split("=")[1];
                        console.log(param1, param2, param3)
                        var exists = false;
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("Movies");
                            var query = { movie_name: param1 };
                            dbo.collection(coll).find(query).toArray(function (err, result) {
                                if (err) throw err;
                                if (Object.keys(JSON.parse(JSON.stringify(result))).length != 0)
                                    exists = true;
                                if (!exists) {

                                    dbo.collection(coll).find({}).toArray(function (err, result) {
                                        if (err) throw err;
                                        var nr_max = Object.keys(JSON.parse(JSON.stringify(result))).length + 1;

                                        var myobj = { nr: nr_max, movie_name: param1, lead_actor: param2, year: parseInt(param3) };
                                        dbo.collection(coll).insertOne(myobj, function (err, res) {
                                            if (err) throw err;
                                            console.log("1 document inserted");
                                            response.writeHead(200, { "Content-Type": "application/json" });
                                            response.write("1 document inserted");
                                            response.end();
                                            db.close();
                                        });
                                    });
                                }
                                else {
                                    response.writeHead(409, { "Content-Type": "application/json" });
                                    response.write("Already exists");
                                    response.end();
                                    db.close();
                                }
                            });
                        });

                        break;
                    case "PUT":
                        console.log("Put")
                        var param1 = params.split("&")[0].split("=")[1];
                        var param2 = params.split("&")[1].split("=")[1];
                        var param3 = params.split("&")[2].split("=")[1];

                        console.log(param1, param2, param3)
                        var exists = false;
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("Movies");
                            var query = { movie_name: param1 };
                            dbo.collection(coll).find(query).toArray(function (err, result) {
                                if (err) throw err;
                                if (Object.keys(JSON.parse(JSON.stringify(result))).length != 0)
                                    exists = true;
                                if (exists) {

                                    MongoClient.connect(uri, function (err, db) {
                                        if (err) throw err;
                                        var dbo = db.db("Movies");
                                        var myquery = { movie_name: param1 };
                                        var newvalues = { $set: { lead_actor: param2, year: parseInt(param3) } };
                                        dbo.collection(coll).updateOne(myquery, newvalues, function (err, res) {
                                            if (err) throw err;
                                            console.log("1 document updated");
                                            response.writeHead(200, { "Content-Type": "application/json" });
                                            response.write("Movie updated");
                                            response.end();
                                            db.close();
                                        });
                                    });
                                }
                                else {
                                    response.writeHead(404, { "Content-Type": "application/json" });
                                    response.write("Movie doesent exists");
                                    response.end();
                                    db.close();
                                }
                            });
                        });
                        break;
                    case "DELETE":
                        console.log("Delete");
                        var param1 = params.split("&")[0].split("=")[1];
                        console.log(param1);
                        var exists = false;
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("Movies");
                            var query = { movie_name: param1 };
                            dbo.collection(coll).find(query).toArray(function (err, result) {
                                if (err) throw err;
                                if (Object.keys(JSON.parse(JSON.stringify(result))).length != 0)
                                    exists = true;
                                if (exists) {

                                    MongoClient.connect(uri, function (err, db) {
                                        if (err) throw err;
                                        var dbo = db.db("Movies");
                                        var myquery = { movie_name: param1 };
                                        dbo.collection(coll).deleteOne(myquery, function (err, obj) {
                                            if (err) throw err;
                                            console.log("1 document deleted");
                                            response.writeHead(200, { "Content-Type": "application/json" });
                                            response.write("1 document deleted");
                                            response.end();
                                            db.close();
                                            db.close();
                                        });
                                    });
                                }
                                else {
                                    response.writeHead(404, { "Content-Type": "application/json" });
                                    response.write("Movie not found");
                                    response.end();
                                    db.close();
                                }
                            });
                        });

                        break;
                    default:
                        response.writeHead(400, { "Content-Type": "" });
                        response.write("method unsuported");
                        response.end();
                }
                break;
            default:
                console.log("unsuported request");
                response.writeHead(400, { "Content-Type": "application/json" });
                response.write("unsuported request")
                response.end();
        }

    }



});

app.listen(3000);