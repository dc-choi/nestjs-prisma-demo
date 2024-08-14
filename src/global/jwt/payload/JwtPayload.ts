import { MemberRole } from "@prisma/client";

export interface JwtPayload {
    memberId: number;
    role: MemberRole;
}
