import { ExistingMember, InvalidMember } from "@global/common/error";
import { EnvConfig } from "@global/env/Env.config";
import { Repository } from "@infra/dao/Repository";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { SignupRequestDto, SignupResponseDto } from "../domain/dto/Signup.dto";
import { IdBlackList } from "../domain/idBlackList";

import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class MemberService extends Repository {
    constructor(
        protected readonly prisma: PrismaService,
        private readonly config: ConfigService<EnvConfig, true>
    ) {
        super(prisma);
    }

    async getMember() {
        return await this.memberRepository.findMany();
    }

    async signup(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
        const secret = this.config.get("SECRET");
        const member = SignupRequestDto.toEntity(signupRequestDto, secret);
        const { name, email } = member;

        if (IdBlackList.includes(name)) throw new BadRequestException(new InvalidMember());

        const findMember = await this.memberRepository.findFirst({
            where: {
                name,
                email,
            },
        });
        if (findMember) throw new ConflictException(new ExistingMember());

        const newMember = await this.memberRepository.create({
            data: member,
        });

        return SignupResponseDto.toDto(newMember);
    }
}
