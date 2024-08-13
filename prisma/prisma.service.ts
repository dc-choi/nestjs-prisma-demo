import { sqlLogger } from "@global/logger/Winston.config";
import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: [{ emit: "event", level: "query" }],
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
