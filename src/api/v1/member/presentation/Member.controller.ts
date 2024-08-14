import { ExistingMember, InvalidMember } from "@global/common/error";
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { MemberService } from "../application/Member.service";
import { SignupRequestDto, SignupResponseDto } from "../domain/dto/Signup.dto";

@ApiTags("Member API's")
@Controller("v1/members")
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Get()
    async getMember() {
        return await this.memberService.getMember();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "회원가입" })
    @ApiResponse({ status: HttpStatus.OK, type: SignupResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: InvalidMember })
    @ApiResponse({ status: HttpStatus.CONFLICT, type: ExistingMember })
    async signup(@Body() signupRequestDto: SignupRequestDto) {
        return await this.memberService.signup(signupRequestDto);
    }
}
