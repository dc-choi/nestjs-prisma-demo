import { Unauthorized } from "@global/common/error/AuthError";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MemberRole } from "@prisma/client";

@Injectable()
export class UserGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any) {
        if (err) throw err;

        if (!user || (user.role !== MemberRole.ADMIN && user.role !== MemberRole.VIP)) {
            throw new UnauthorizedException(new Unauthorized(user.role));
        }

        return user;
    }
}
