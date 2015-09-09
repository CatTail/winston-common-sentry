var util = require('util');
var raven = require('raven');
var winston = require('winston');
var _ = require('underscore');

var Sentry = winston.transports.Sentry = function (options) {
    this._dsn = options.dsn || '';
    this._sentry = options.raven ||
        new raven.Client(this._dsn, {logger: options.logger || 'root'});

    // Set the level from your options
    this.level = options.level || 'info';

    // Handle errors
    this._sentry.on('error', function() {
        console.log("Cannot talk to sentry!");
    });

    // Expose sentry client to winston.Logger
    winston.Logger.prototype.sentry_client = this._sentry;
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(Sentry, winston.Transport);

Sentry.LEVELS_MAP = {
    silly: 'debug',
    verbose: 'debug',
    info: 'info',
    debug: 'debug',
    warn: 'warning',
    error: 'error'
};

//
// Expose the name of this Transport on the prototype
Sentry.prototype.name = 'sentry';
//

Sentry.prototype.log = function (level, message, meta, callback) {
    level = Sentry.LEVELS_MAP[level] || this.level;
    meta = meta || {};

    meta = _.clone(meta);

    var tags = meta.tags || null;
    delete meta.tags;

    var extra = {
        'level': level,
        'extra': meta,
        'tags': tags
    };

    if (meta.request) {
        extra.request = meta.request;
        delete meta.request;
    }

    if (meta.user) {
        extra.user = meta.user;
        delete meta.user;
    }

    if (level === 'error') {
        if (meta.error && meta.error instanceof Error) {
            meta.message = message + ': ' + meta.error.message;
            message = meta.error;
            delete meta.error;
        }
        this._sentry.captureError(message, extra, function() {
            callback(null, true);
        });
    } else {
        this._sentry.captureMessage(message, extra, function() {
            callback(null, true);
        });
    }
};

module.exports = Sentry;
