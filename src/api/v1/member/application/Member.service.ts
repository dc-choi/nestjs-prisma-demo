import { ExistingMember, InvalidMember } from "@global/common/error";
import { EnvConfig } from "@global/env/Env.config";
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
        private readonly config: ConfigService<EnvConfig, true>
    ) {}

    async findAll() {
        const members = await this.repository.member.findMany();
        return FindAllMemberResponseDto.toDto(members);
    }

    async signup(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
        const secret = this.config.get("SECRET");
        const member = SignupRequestDto.toEntity(signupRequestDto, secret);
        const { name, email } = member;

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

        return SignupResponseDto.toDto(newMember);
    }
}
