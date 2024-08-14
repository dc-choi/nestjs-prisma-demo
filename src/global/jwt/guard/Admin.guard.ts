import { Unauthorized } from "@global/common/error/AuthError";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MemberRole } from "@prisma/client";

@Injectable()
export class AdminGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any) {
        if (err || !user || user.role !== MemberRole.ADMIN) {
            throw new UnauthorizedException(new Unauthorized(user.role));
        }

        return user;
    }
}
