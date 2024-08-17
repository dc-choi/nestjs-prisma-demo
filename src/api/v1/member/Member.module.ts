import { MailModule } from "@infra/mail/Mail.module";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { MemberService } from "./application/Member.service";
import { MemberController } from "./presentation/Member.controller";

@Module({
    imports: [MailModule, CqrsModule],
    controllers: [MemberController],
    providers: [MemberService],
})
export class MemberModule {}
