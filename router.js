const Authentication = require('./controllers/authentication');
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://7bf7cc42963a4393b13032b7a373e7c1@sentry.io/1407854' });

module.exports = function (app) {

    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());

    app.get('/', function (req, res) {
        res.send({message: 'Hello World! I\'m an unprotected route!'});
    });

    app.get('/api', function (req, res) {
        res.send({message: 'Hello World! I\'m a protected route!'});
    });

    app.post('/api/v1/signup', Authentication.signup);

    // isAuthorized stores basic information about the current user.
    app.get('/api/v1/account', Authentication.isAuthorized, Authentication.currentUserAccountData);

    // The error handler must be before any other error middleware
    app.use(Sentry.Handlers.errorHandler());

    // Optional fallthrough error handler
    app.use(function onError(err, req, res, next) {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        // NOTE: Not currently using `res.sentry`
        res.status(500).send({ error: 'Unexpected error occured.' })
    });
};