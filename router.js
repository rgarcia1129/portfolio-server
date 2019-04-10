// const Authentication = require('./controllers/authentication');
const LinkedIn = require('./controllers/linkedin');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send({message: 'Hello World!'});
    });

    app.get('/api/linkedin/accountInfo', LinkedIn.accountInfo);

    app.use(function onError(err, req, res, next) {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        // NOTE: Not currently using `res.sentry`
        res.status(500).send({ error: 'Unexpected error occured.' })
    });
};
