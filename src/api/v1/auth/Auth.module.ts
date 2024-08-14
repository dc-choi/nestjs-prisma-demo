import { Module } from "@nestjs/common";

import { AuthService } from "./application/Auth.service";
import { AuthController } from "./presentation/Auth.controller";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
