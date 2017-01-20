var express = require('express');
var router = express.Router();
var fs = require('fs');
var WSS = require('ws').Server;
var wss = new WSS({ port: 8080 });
var request = require('request');

var addHour;
var date;
var dateAddHour;
var collection;
var parsedCollection;
var requestUrl = 'https://www.rijksmuseum.nl/api/nl/collection?ps=1&key=imrDormX&format=json&type=schilderij';

router.use(function(req, res, next) {
    /* Sever Sent Event */  
    if (req.headers.accept == 'text/event-stream') {
        sendSSE(req, res);
    } else {
        res.write(fs.readFileSync(__dirname + '/../public/views/index.hbs'));
        res.end();
    }

    function sendSSE(req, res) {
        //specific head needed to create stream
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        // trigger a change each second
        // this should be an event from the api that indicates there are new items.
        setInterval(function() {
            request(requestUrl, function(req, res) {
                collection = JSON.parse(res.body);
                return collection;
            });
            
            if(collection != undefined) {
                constructSSE(res, collection);
            } 
            
        }, 5000);
    
    }

    function constructSSE(res, collection) {
        var collection = collection.artObjects;
        collection.forEach(function(art) {
            //server sent event stream format: start with data: + object + \n\n
            res.write('data: '+ JSON.stringify({id: art.id})+ '\n\n');
            res.write('data: '+ JSON.stringify({title: art.title}) +'\n\n');
            res.write('data: '+ JSON.stringify({url: art.webImage.url})  +'\n\n');
        });
        // garbage collection
        resetArray(collection);        
    }

    function resetArray(collection) {
        collection = [];
    }
        /* Websocket */
    if(req.url == '/') {
        startWebsocket();
    }

    function startWebsocket() {
        wss.on('connection', function(socket) {
            console.log('connection open');

            // var json = __dirname + '/../messages.json';

            // fs.readFile(json, function(err, data){
            //     socket.send(data);
            // });

            socket.on('message', function(message) {
                console.log(JSON.stringify(message.id));
                console.log(JSON.stringify(message.votes));
                // var artObject = [
                //     {'id':JSON.stringify(message.id)},
                //     {'votes': JSON.stringify(message.votes)}
                // ];            
                
                // var addMessage = JSON.stringify({'data': message});
                
                // fs.writeFile(json, addMessage, function(err, data) {
                //     console.log(err, data);
                // });

                // socket.send(addMessage);
            });

            socket.on('close', function (code, reason) {
                console.log('connection closed');

                socket.removeAllListeners();
                socket.close();
            });
        });
    }
    // multiplexing
    // compression
});

module.exports = router;