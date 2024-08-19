import { MemberRole } from "@prisma/client";

export interface JwtPayload {
    memberId: bigint;
    role: MemberRole;
}
