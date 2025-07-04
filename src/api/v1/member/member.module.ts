import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MemberService } from './application/member.service';
import { MemberController } from './presentation/member.controller';

@Module({
    imports: [CqrsModule],
    controllers: [MemberController],
    providers: [MemberService],
})
export class MemberModule {}
