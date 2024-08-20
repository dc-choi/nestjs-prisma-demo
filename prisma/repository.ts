import { MemberEntity } from "@api/v1/member/domain/entity/Member.entity";
import { sqlLogger } from "@global/logger/Winston.config";
import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class Repository extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: [{ emit: "event", level: "query" }],
            transactionOptions: {
                timeout: 5000,
                maxWait: 10000,
            },
        });

        /**
         * TODO: $extends로 변경이 필요함.
         * 적용 시도를 하였으나 에러가 발생하여 일단은 $use로 대체함.
         */
        this.$use(async (params, next) => {
            const result = await next(params);
            switch (params.model) {
                case Prisma.ModelName.Member:
                    const member = new MemberEntity(result);
                    return member;
                default:
                    break;
            }
        });
    }

    async onModuleInit() {
        (BigInt.prototype as any).toJSON = function () {
            return this.toString();
        };

        await this.$connect();

        // Prisma query 이벤트를 가로채서 로그 출력
        this.$on("query" as never, (event: any) => {
            sqlLogger.verbose!(`Prisma\nquery: ${event.query}\nparams: ${event.params}\ntimestamp: ${event.timestamp}`);
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on("beforeExit", async () => {
            await app.close();
        });
    }
}
