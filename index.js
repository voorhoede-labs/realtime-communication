const browserSync = require('browser-sync');
const express = require('express');
const router = require('./routes/index');
const app = express();
const port = 9777; // "xprs" in T9
const path = require('path');

app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'hbs');

// you can conditionally add routes and behaviour based on environment
const isDevelopment = 'development' === process.env.NODE_ENV;
const isProduction = 'production' === process.env.NODE_ENV;

// static example, add real routes here instead
app.use('/', router);

app.listen(port, listening);

// app.use(express.static(path.join(__dirname, 'public')));

function listening () {
    console.log('Demo server available on http://localhost:' + port);
    if(isDevelopment) {
        // https://ponyfoo.com/articles/a-browsersync-primer#inside-a-node-application
        browserSync({
            files: ['public/styles/*.{css}','public/views/*.{html,hbs}','public/scripts/*.{js}'],
            online: false,
            open: false,
            port: port + 1,
            proxy: 'localhost:' + port,
            ui: false
        });
    }
}
