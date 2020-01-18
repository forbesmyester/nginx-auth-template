const express = require('express');
const app = express();

var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'app'});

app.get('/', (req, res) => {
    logger.info({username: req.header('x-auth-display-name'), event: 'page_loaded', page: "/"}, `User ${req.header('x-auth-display-name')} viewed page "/"`)
    res.send(`
        <html>
        <head><title>Welcome</title></head>
        <body>
        <h1>Welcome</h1>
        <p>Hello <strong>${req.header('x-auth-display-name')}</strong></p>
        <p>Welcome to my website</p>
        <style>
            html { background-color: #DDD; text-align: center; }
            body {
                display: inline-block;
                margin: 3em;
                padding: 3em;
                width: 30em;
                border: 0.5rem solid #CCC;
                background-color: #EEE;
            }
        </style>
        </body>
        </html>
    `)
});

app.listen(80, () => logger.info({port: 80, event: 'service_started'}, `App listening`));
