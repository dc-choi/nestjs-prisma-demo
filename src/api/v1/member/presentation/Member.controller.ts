import { ExistingMember, InvalidMember } from "@global/common/error/MemberError";
import { CommonGuard } from "@global/jwt/guard/Common.guard";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { MemberService } from "../application/Member.service";
import { SignupRequestDto, SignupResponseDto } from "../domain/dto/Signup.dto";

@ApiTags("Member API's")
@Controller("v1/members")
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "회원가입" })
    @ApiResponse({ status: HttpStatus.OK, type: SignupResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: InvalidMember })
    @ApiResponse({ status: HttpStatus.CONFLICT, type: ExistingMember })
    async signup(@Body() signupRequestDto: SignupRequestDto) {
        return await this.memberService.signup(signupRequestDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(CommonGuard)
    @ApiBearerAuth("Authorization")
    @ApiResponse({ status: HttpStatus.OK, type: SignupResponseDto, isArray: true })
    @ApiOperation({ summary: "회원 내역 조회" })
    async findAll() {
        return await this.memberService.findAll();
    }
}
