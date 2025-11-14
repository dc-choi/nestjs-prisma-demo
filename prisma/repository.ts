import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Prisma, PrismaClient } from '@prisma/client';

import type { DB } from './generated/types';
import { PRISMA_ADAPTER } from './mysql.adapter';

import { CamelCasePlugin, Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from 'kysely';
import kyselyExtension from 'prisma-extension-kysely';
import { sqlLog } from '~/global/common/logger/channel.logger';
import { EnvConfig } from '~/global/config/env/env.config';

export const REPOSITORY = 'REPOSITORY';

export const createRepository = (adapter: PrismaMariaDb, configService: ConfigService<EnvConfig, true>) => {
    const prisma = new PrismaClient({
        adapter,
        log: [{ emit: 'event', level: 'query' }],
        transactionOptions: {
            timeout: 5000,
            maxWait: 10000,
            isolationLevel: 'RepeatableRead',
        },
    });

    // BigInt를 JSON으로 변환할 때 문자열로 변환
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };

    // Prisma query 이벤트를 가로채서 구조화 로그 출력 (슬로우 쿼리 여부 포함)
    prisma.$on('query' as never, (event: Prisma.QueryEvent) => {
        const { query, params, target, timestamp, duration } = event;
        sqlLog.log({
            type: 'PRISMA QUERY',
            env: configService.get<string>('ENV'),
            timestamp,
            query,
            params,
            durationMs: duration,
            target,
            isSlowQuery: duration >= 500,
            slowQueryThresholdMs: 500,
        });
    });

    return prisma.$extends(
        kyselyExtension({
            kysely: (driver) =>
                new Kysely<DB>({
                    dialect: {
                        createDriver: () => driver,
                        createAdapter: () => new MysqlAdapter(),
                        createIntrospector: (db) => new MysqlIntrospector(db),
                        createQueryCompiler: () => new MysqlQueryCompiler(),
                    },
                    plugins: [new CamelCasePlugin()],
                }),
        })
    );
};

export type Repository = ReturnType<typeof createRepository>;

export const RepositoryProvider: Provider = {
    provide: REPOSITORY,
    useFactory: createRepository,
    inject: [PRISMA_ADAPTER, ConfigService],
};
