const express = require('express');
const router = express.Router();
var fs = require('fs');
// always invoked
router.use(function(req, res, next) {

    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        if (req.url == '/') {
            sendSSE(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }

    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync(__dirname + '/../views/index.hbs'));
        res.end();
    }

    function sendSSE(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        var id = (new Date()).toLocaleTimeString();

        // trigger a change each second
        setInterval(function() {
            constructSSE(res, id, (new Date()).toLocaleTimeString());
        }, 1000);
    }

    function constructSSE(res, id, data) {
        res.write('id: ' + id + '\n');
        res.write("data: " + data + '\n\n');
    }


});

module.exports = router;
