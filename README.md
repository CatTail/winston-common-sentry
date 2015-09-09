# winston-common-sentry
> Sentry transport for winston, fork of [winston-sentry](https://github.com/guzru/winston-sentry)

## Usage

```javascript
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
```

## Note

Winston logging levels are mapped to the default sentry levels like this:

```
silly: 'debug',
verbose: 'debug',
info: 'info',
debug: 'debug',
warn: 'warning',
error: 'error',
```
