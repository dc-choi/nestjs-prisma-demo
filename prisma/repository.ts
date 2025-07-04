import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { sqlLogger } from '~/global/config/logger/winston.config';

@Injectable()
export class Repository extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
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

        // Prisma query 이벤트를 가로채서 로그 출력
        this.$on('query' as never, (event: any) => {
            sqlLogger.verbose!(`Prisma\nquery: ${event.query}\nparams: ${event.params}\ntimestamp: ${event.timestamp}`);
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
