const {format, transports, createLogger} = require('winston');
require('winston-daily-rotate-file');

const path = require('path');
const config = require('config');

const env = config.get('env.NODE_ENV');

var transport = new (transports.DailyRotateFile)({
    filename: './logs/applogs-%DATE%',
    extension: '.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '5m'
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.label({label: path.basename(process.mainModule.filename)}),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.prettyPrint()
    ),
    transports: [
            transport
    ]
});

if(env !== 'production'){
    logger.add(new transports.Console({
        level: 'info',
        eol: '\n',
        timestamp: true
    }))
}
module.exports = logger;