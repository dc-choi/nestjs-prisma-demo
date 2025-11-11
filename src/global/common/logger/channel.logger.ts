import { LoggerService } from '@nestjs/common';

import { httpLogger, sqlLogger, verboseLogger } from '~/global/config/logger/winston.config';

interface TypedLogger<T> {
    log(entry: T): void;
}

const createTypedLogger = <T>(
    backing: LoggerService,
    method: 'log' | 'verbose' | 'debug' | 'warn' | 'error' = 'log'
): TypedLogger<T> => {
    return {
        log(entry: T) {
            const logger = backing;
            if (method === 'verbose' && typeof logger.verbose === 'function') return logger.verbose(entry);
            if (method === 'debug' && typeof logger.debug === 'function') return logger.debug(entry);
            if (method === 'warn' && typeof logger.warn === 'function') return logger.warn(entry);
            if (method === 'error' && typeof logger.error === 'function') return logger.error(entry);
            return logger.log(entry);
        },
    };
};

// SQL (Prisma) channel
export interface PrismaQueryLog {
    type: 'PRISMA QUERY';
    env: string;
    timestamp: Date;
    query: string;
    params: string;
    durationMs: number;
    target: string;
    isSlowQuery: boolean;
    slowQueryThresholdMs: number;
}

export const sqlLog: TypedLogger<PrismaQueryLog> = createTypedLogger<PrismaQueryLog>(sqlLogger);

// HTTP channel
export interface HttpRequestLog {
    type: 'HTTP REQUEST';
    env: string;
    version: string;
    origin: string;
    method: string;
    url: string;
    params: Record<string, string | string[]>;
    query: Record<string, unknown>;
    body: unknown;
}

export interface HttpResponseLog {
    type: 'HTTP RESPONSE';
    env: string;
    origin: string;
    method: string;
    url: string;
    response: unknown;
}

export type HttpLog = HttpRequestLog | HttpResponseLog;

export const httpLog: TypedLogger<HttpLog> = createTypedLogger<HttpLog>(httpLogger);

// Verbose channel (feature teams can further narrow with `createTypedLogger`)
export interface VerbosePayload {
    type: string;
    env: string;
    // Additional structured fields are encouraged per-feature
    [key: string]: unknown;
}

export const verboseLog: TypedLogger<VerbosePayload> = createTypedLogger<VerbosePayload>(verboseLogger, 'verbose');
