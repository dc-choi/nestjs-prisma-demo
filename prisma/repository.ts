import { INestApplication, Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Prisma, PrismaClient } from '@prisma/client';

import { PRISMA_ADAPTER } from './mysql.adapter';

import { sqlLog } from '~/global/common/logger/channel.logger';
import { EnvConfig } from '~/global/config/env/env.config';

@Injectable()
export class Repository extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(PRISMA_ADAPTER) adapter: PrismaMariaDb,
        private readonly config: ConfigService<EnvConfig, true>
    ) {
        super({
            adapter,
            log: [{ emit: 'event', level: 'query' }],
            transactionOptions: {
                timeout: 5000,
                maxWait: 10000,
            },
        });

        /**
         * 적용 시도를 하였으나 에러가 발생하여 일단은 $use로 대체함.
         *
         * 도메인 모델 패턴을 사용하지 않고 개발...
         */
        // this.$use(async (params, next) => {
        //     const result = await next(params);
        //     switch (params.model) {
        //         case Prisma.ModelName.Member:
        //             const member = Array.isArray(result)
        //                 ? result.map((param) => {
        //                       return new MemberEntity(param);
        //                   })
        //                 : new MemberEntity(result);
        //             return member;
        //         default:
        //             break;
        //     }
        // });
    }

    async onModuleInit() {
        (BigInt.prototype as any).toJSON = function () {
            return this.toString();
        };

        await this.$connect();

        // Prisma query 이벤트를 가로채서 구조화 로그 출력 (슬로우 쿼리 여부 포함)
        this.$on('query' as never, (event: Prisma.QueryEvent) => {
            const { query, params, target, timestamp, duration } = event;
            /**
             * 클라이언트가 쿼리를 발행한 시점부터 데이터베이스가 응답할 때까지 경과한 시간(밀리초 단위)
             * 단순히 쿼리 실행에 소요된 시간이 아닙니다.
             * 단일 레벨 로그로 모두 남기고, payload에 슬로우 여부를 포함 (타입 세이프)
             */
            sqlLog.log({
                type: 'PRISMA QUERY',
                env: this.config.get<string>('ENV'),
                timestamp,
                query,
                params,
                durationMs: duration,
                target,
                isSlowQuery: duration >= 500,
                slowQueryThresholdMs: 500,
            });
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on('beforeExit', async () => {
            await app.close();
        });
    }
}
