import { ExistingMember, InvalidMember } from "@global/common/error/MemberError";
import { EnvConfig } from "@global/env/Env.config";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventBus } from "@nestjs/cqrs";

import { FindAllMemberResponseDto } from "../domain/dto/FindAllMember.dto";
import { SignupRequestDto, SignupResponseDto } from "../domain/dto/Signup.dto";
import { IdBlackList } from "../domain/idBlackList";
import { SignupEvent } from "./event/Signup.event";

import { Repository } from "prisma/repository";

@Injectable()
export class MemberService {
    constructor(
        private readonly repository: Repository,
        private readonly config: ConfigService<EnvConfig, true>,
        private readonly eventBus: EventBus
    ) {}

    async findAll() {
        const members = await this.repository.member.findMany();
        return FindAllMemberResponseDto.toDto(members);
    }

    async signup(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
        const secret = this.config.get<string>("SECRET");
        const emails = this.config.get<string>("MAIL_SIGNUP_ALERT_USER");
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

        this.eventBus.publish(new SignupEvent(email, name, phone, emails));

        return SignupResponseDto.toDto(newMember);
    }
}
