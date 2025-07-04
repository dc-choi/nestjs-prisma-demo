import { Module } from '@nestjs/common';

import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';

import { TokenModule } from '~/global/jwt/token.module';

@Module({
    imports: [TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
