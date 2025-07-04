import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Unauthorized } from '~/global/common/error/auth.error';

@Injectable()
export class AllGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        if (err) throw err;

        if (!user) {
            throw new UnauthorizedException(new Unauthorized(user.role));
        }

        return user;
    }
}
