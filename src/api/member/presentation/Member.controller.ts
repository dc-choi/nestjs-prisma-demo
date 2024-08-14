import { Controller, Get } from "@nestjs/common";

import { MemberService } from "../application/Member.service";

@Controller("members")
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Get()
    async getMember() {
        return await this.memberService.getMember();
    }
}
