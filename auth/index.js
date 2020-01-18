const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: false }));

var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'auth'});

app.get('/', (req, res) => {
    if (req.session && req.session.username) {
        logger.info({event: 'allowed', user: req.session.username}, `Continued session ${req.session.username}`);
        return res.header('X-Auth-Username', req.session.username).send("GO");
    }
    logger.info({event: 'rejected'}, `Rejected session`);
    return res.status(401).send(`
        <html>
        <head><title>App Authentication</title></head>
        <body>
            <form method="post" action="./">
                <h1>Please log in</h1>
                <p><label>username: <input name="username"></label></p>
                <p><label>password: <input type="password" name="password"></label></p>
                <p><input type="submit"/></p>
            </form>
            <style>
                body { text-align: center; background-color: #DDD; }
                form {
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
    `);
});

app.post('/', (req, res, next) => {
    if (req.body && req.body.password == 'password') {
        logger.info({username: req.body.username, event: 'logged_in'}, `User ${req.body.username} logged in`)
        req.session.username = req.body.username;
    } else {
        logger.info({username: req.body.username, event: 'logged_in_fail'}, `User ${req.body.username} attempted to log in`)
    }
    res.redirect('/');
});

app.listen(80, () => logger.info({port: 80, event: 'service_started'}, `Authentication listening`))
