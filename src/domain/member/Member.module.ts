import { Module } from "@nestjs/common";

import { MemberService } from "./application/Member.service";
import { MemberController } from "./presentation/Member.controller";

@Module({
    controllers: [MemberController],
    providers: [MemberService],
})
export class MemberModule {}
