var winston = require('winston');
var Sentry = require('winston-common-sentry');

var logger = new winston.Logger({
    transports: [
        new Sentry({
                level: 'warn',
                dsn: '{{ YOUR SENTRY DSN }}'
        })
    ],
});

logger.warn('This is warning message');
try {
    throw new Error('some error');
} catch(err) {
    logger.error('This is error message', {error: err});
}
