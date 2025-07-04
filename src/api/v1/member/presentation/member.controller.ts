import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MemberService } from '../application/member.service';
import { SignupRequestDto, SignupResponseDto } from '../domain/dto/signup.dto';

import { FindAllMemberResponseDto } from '~/api/v1/member/domain/dto/findAllMember.dto';
import { ExistingMember, InvalidMember } from '~/global/common/error/member.error';
import { CommonGuard } from '~/global/jwt/guard/common.guard';

@ApiTags('Member APIs')
@Controller('v1/members')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({ status: HttpStatus.OK, type: SignupResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: InvalidMember })
    @ApiResponse({ status: HttpStatus.CONFLICT, type: ExistingMember })
    async signup(@Body() signupRequestDto: SignupRequestDto) {
        return await this.memberService.signup(signupRequestDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(CommonGuard)
    @ApiBearerAuth('Authorization')
    @ApiResponse({ status: HttpStatus.OK, type: FindAllMemberResponseDto, isArray: true })
    @ApiOperation({ summary: '회원 내역 조회' })
    async findAll() {
        return await this.memberService.findAll();
    }
}
