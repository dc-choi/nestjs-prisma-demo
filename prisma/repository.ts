import { sqlLogger } from "@global/logger/Winston.config";
import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * #### INFO: 다음 방법으로도 가능
 *
 * - 1번 방법 (타입 안정성은 더 좋지만 코드가 길어짐)
 * ```typescript
 * const newMember = new MemberEntity();
 * const memberData = await this.memberRepository.create({
 *   data: member,
 * })
 * Object.assign(newMember, memberData);
 * ```
 * - 2번 방법 (코드가 간결하지만 타입 안정성이 떨어짐)
 * ```typescript
 * const newMember = (await this.memberRepository.create({
 *   data: member,
 * })) as MemberEntity;
 * ```
 */
@Injectable()
export class Repository extends PrismaClient implements OnModuleInit, OnModuleDestroy {
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
