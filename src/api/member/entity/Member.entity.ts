import { BaseTimeEntity } from "@global/common/entity/BaseTime.entity";
import { Member, MemberRole } from "@prisma/client";

import { createHmac } from "crypto";

export class MemberEntity extends BaseTimeEntity implements Member {
    id: bigint;

    name: string;

    email: string;

    hashedPassword: string | null;

    phone: string;

    role: MemberRole;

    lastLoginAt: Date | null;

    constructor(props: MemberEntityProps) {
        const { name, email, password, phone, role, secret } = props;
        super();

        this.name = name;
        this.email = email;
        this.hashedPassword = password ? this.generateHashedPassword(password, secret) : null;
        this.phone = phone;
        this.role = role;
    }

    private generateHashedPassword(password: string, salt: string) {
        return createHmac("sha256", salt).update(password).digest("base64");
    }
}

export interface MemberEntityProps extends Pick<MemberEntity, "name" | "email" | "phone" | "role"> {
    password: string | null;
    secret: string;
}
