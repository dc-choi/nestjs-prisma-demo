import { TokenModule } from "@global/jwt/Token.module";
import { Module } from "@nestjs/common";

import { AuthService } from "./application/Auth.service";
import { AuthController } from "./presentation/Auth.controller";

@Module({
    imports: [TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
