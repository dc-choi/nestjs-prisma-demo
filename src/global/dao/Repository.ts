import { Injectable } from "@nestjs/common";

import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class Repository {
    constructor(protected readonly prisma: PrismaService) {}

    get memberRepository() {
        return this.prisma.member;
    }

    get subscribeRepository() {
        return this.prisma.subscribe;
    }

    get subscribeDetailRepository() {
        return this.prisma.subscribeDetail;
    }

    get paymentRepository() {
        return this.prisma.payment;
    }

    get transactionRepository() {
        return this.prisma.transaction;
    }
}
