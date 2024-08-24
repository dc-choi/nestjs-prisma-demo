import { BaseTimeEntity } from "@global/common/entity/BaseTime.entity";
import { Member, MemberRole, Payment, Subscribe, SubscribeDetail, Transaction } from "@prisma/client";

import { createHmac } from "crypto";

export class MemberEntity extends BaseTimeEntity implements Member {
    id: bigint;

    name: string;

    email: string;

    hashedPassword: string | null;

    phone: string;

    role: MemberRole;

    lastLoginAt: Date | null;

    Subscribe: Subscribe[] | null;

    SubscribeDetail: SubscribeDetail[] | null;

    Payment: Payment[] | null;

    Transaction: Transaction[] | null;

    constructor(...args: any[]) {
        super();
        Object.assign(this, args[0]);
    }

    public generateHashedPassword(password: string, salt: string) {
        this.hashedPassword = createHmac("sha256", salt).update(password).digest("base64");
    }
}
