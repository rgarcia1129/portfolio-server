const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://7bf7cc42963a4393b13032b7a373e7c1@sentry.io/1407854' });

exports.captureException = function(exception) {
    Sentry.captureException(exception);
};

exports.captureMessage = function(message) {
    Sentry.captureMessage(message);
};