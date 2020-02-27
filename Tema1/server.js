const url = require('url');
const http = require('http');
const fs = require('fs')
//const req = require("request");
var geolocKey;
var lastfmkey;
const app = http.createServer((request, response) => {


    fs.readFile('keys.txt', 'utf8', function(err, data) {
        if (err) throw err;
        //console.log(data);
         geolocKey = data.split("\n")[0];
         lastfmkey = data.split("\n")[1];
       
      });

    //console.log(request.url);
    if (request.url == "/"){
        //console.log("ceva");
        fs.readFile('./client.html', (err, data) => {
            if (err) throw err;
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data)
            response.end();
          });
    }
    else
    {
        const req = request.url.split("&")[0];
        //console.log(req);
        if(req == "/?request=generateNumber")
        {
            const req = require("request");
            var min = request.url.split("&")[1].split("=")[1];
            var max = request.url.split("&")[2].split("=")[1];
            //console.log(min,max);
            var url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
            req.get(url, function(error, resp, oldbody) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(oldbody);
                response.end();
                //var data = `Request: ${url} - responce: ${body}`;
                fs.readFile('./Log.txt', 'utf8', function(err, data) {
                    if (err) throw err;
                    //console.log(data);
                     data = data + `Request: ${url}\n   Responce: ${oldbody}\n`;
                     fs.writeFile('./Log.txt', data, (err) => { 
      
                        // In case of a error throw err. 
                        if (err) throw err; 
                    }) 
                   
                  });
            });
        }
        if(req == "/?request=generateLocation")
        {
            var latitude = request.url.split("&")[1].split("=")[1];;
            var longitude = request.url.split("&")[2].split("=")[1];;
            const req = require("request");
            var url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geolocKey}`;
            req.get(url, function(error, resp, oldbody) {
                body = JSON.parse(oldbody);
                var ceva = body.results[0]["components"]["county"] + ", " + body.results[0]["components"]["country"];
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(ceva);
                response.end();
                //console.log(body);
                //var data = `Request: ${url} - responce: ${body}`;
                fs.readFile('./Log.txt', 'utf8', function(err, data) {
                    if (err) throw err;
                    //console.log(data);
                     data = data + `Request: ${url}\n   Responce: ${oldbody}\n\n`;
                     fs.writeFile('./Log.txt', data, (err) => { 
      
                        // In case of a error throw err. 
                        if (err) throw err; 
                    }) 
                   
                  });
            });
        }
        if(req == "/?request=generateRecomandations")
        {
            var nr = request.url.split("&")[1].split("=")[1];;
            var loc = request.url.split("&")[2].split("=")[1];;
            // console.log(nr,loc);
            const req = require("request");
            var url = `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&limit=${nr}&country=${loc}&api_key=${lastfmkey}&format=json`;
            req.get(url, function(error, resp, oldbody) {
                
                body = JSON.parse(oldbody);
                var dict = {};
                for (var i = 0; i<nr;i++){
                    dict[i] = body["tracks"]["track"][i]["artist"].name +" - " + body["tracks"]["track"][i]["name"];
                }
                var ceva = JSON.stringify(dict);
                // console.log(ceva);
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(ceva);
                response.end();
                
               fs.readFile('./Log.txt', 'utf8', function(err, data) {
                    if (err) throw err;
                    //console.log(data);
                     data = data + `Request: ${url}\n   Responce: ${oldbody}\n\n`;
                     fs.writeFile('./Log.txt', data, (err) => { 
      
                        // In case of a error throw err. 
                        if (err) throw err; 
                    }) 
                   
                  });
            });
        }
    }


});

app.listen(3000);