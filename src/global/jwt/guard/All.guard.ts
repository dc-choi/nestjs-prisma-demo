import { Unauthorized } from "@global/common/error/AuthError";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AllGuard extends AuthGuard("jwt") {
    handleRequest(err: any, user: any) {
        if (err) throw err;

        if (!user) {
            throw new UnauthorizedException(new Unauthorized(user.role));
        }

        return user;
    }
}
