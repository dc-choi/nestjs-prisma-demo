import { ExistingMember, InvalidMember } from "@global/common/error/MemberError";
import { EnvConfig } from "@global/env/Env.config";
import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { FindAllMemberResponseDto } from "../domain/dto/FindAllMember.dto";
import { SignupRequestDto, SignupResponseDto } from "../domain/dto/Signup.dto";
import { IdBlackList } from "../domain/idBlackList";

import { Repository } from "prisma/repository";

@Injectable()
export class MemberService {
    constructor(
        private readonly repository: Repository,
        private readonly config: ConfigService<EnvConfig, true>,
        private readonly mailerService: MailerService
    ) {}

    async findAll() {
        const members = await this.repository.member.findMany();
        return FindAllMemberResponseDto.toDto(members);
    }

    async signup(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
        const secret = this.config.get("SECRET");
        const emails = this.config.get("MAIL_REGISTER_ALERT_USER");
        const member = SignupRequestDto.toEntity(signupRequestDto, secret);
        const { name, email, phone } = member;

        if (IdBlackList.includes(name)) throw new BadRequestException(new InvalidMember());

        const findMember = await this.repository.member.findFirst({
            where: {
                name,
                email,
            },
        });
        if (findMember) throw new ConflictException(new ExistingMember());

        const newMember = await this.repository.member.create({
            data: member,
        });

        await this.mailerService.sendMail({
            to: [emails],
            subject: `[회원 유입] ${name}님이 가입하셨습니다.`,
            template: "./signup",
            context: {
                name,
                email,
                phone,
            },
        });

        return SignupResponseDto.toDto(newMember);
    }
}
