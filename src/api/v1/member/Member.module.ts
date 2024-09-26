import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { MemberService } from "./application/Member.service";
import { MemberController } from "./presentation/Member.controller";

@Module({
    imports: [CqrsModule],
    controllers: [MemberController],
    providers: [MemberService],
})
export class MemberModule {}
