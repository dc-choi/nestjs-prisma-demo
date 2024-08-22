import { WinstonModule, utilities } from "nest-winston";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

export const verboseLogger = WinstonModule.createLogger({
    level: "verbose",
    format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike("Demo", { colors: true, prettyPrint: true })
    ),
    transports: [
        new winstonDaily({
            level: "verbose",
            format: winston.format.combine(
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
            dirname: "logs/verbose",
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
        }),
    ],
});

export const sqlLogger = WinstonModule.createLogger({
    level: "verbose",
    format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike("Demo", { colors: true, prettyPrint: true })
    ),
    transports: [
        new winstonDaily({
            level: "verbose",
            format: winston.format.combine(
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
            dirname: "logs/sql",
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
        }),
    ],
});

export const infoLogger = WinstonModule.createLogger({
    level: "http",
    format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike("Demo", { colors: true, prettyPrint: true })
    ),
    transports: [
        new winstonDaily({
            level: "http",
            format: winston.format.combine(
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
            dirname: "logs/info",
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
        }),
    ],
});

export const winstonTransports = [
    new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike("Demo", { colors: true, prettyPrint: true })
        ),
    }),
    new winstonDaily({
        level: "error",
        format: winston.format.combine(
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
        dirname: "logs/error",
        filename: "%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
    }),
    new winstonDaily({
        level: "warn",
        format: winston.format.combine(
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
        dirname: "logs/warn",
        filename: "%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
    }),
];
