const {format, transports, createLogger} = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
// winston.configure({
//     transports: [
//         new winston.transports.Console({
//             eol: '\n'
//         })
//     ]
// })

var transport = new (transports.DailyRotateFile)({
    filename: './logs/application-%DATE%',
    extension: '.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20k'
})

// transport.on('rotate', (oldFileName, newFileName) => {

// })

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

// if(process.env.NODE_ENV !== 'production'){
//     logger.add(new transports.Console({
//         level: 'info',
//         eol: '\n',
//         timestamp: true
//     }))
// }

module.exports = logger;