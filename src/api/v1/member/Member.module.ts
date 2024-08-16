import { MailModule } from "@infra/mail/Mail.module";
import { Module } from "@nestjs/common";

import { MemberService } from "./application/Member.service";
import { MemberController } from "./presentation/Member.controller";

@Module({
    imports: [MailModule],
    controllers: [MemberController],
    providers: [MemberService],
})
export class MemberModule {}
