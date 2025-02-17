import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';

import { FindAllMemberResponseDto } from '../domain/dto/FindAllMember.dto';
import { SignupRequestDto, SignupResponseDto } from '../domain/dto/Signup.dto';
import { SignupEvent } from './event/Signup.event';

import { Repository } from 'prisma/repository';
import { IdBlackList } from '~/api/v1/member/domain/IdBlackList';
import { MemberDomain } from '~/api/v1/member/domain/Member.domain';
import { ExistingMember, InvalidMember } from '~/global/common/error/MemberError';
import { EnvConfig } from '~/global/config/env/Env.config';

@Injectable()
export class MemberService {
    constructor(
        private readonly repository: Repository,
        private readonly config: ConfigService<EnvConfig, true>,
        private readonly eventBus: EventBus
    ) {}

    async signup(signupRequestDto: SignupRequestDto) {
        const emails = this.config.get<string>('MAIL_SIGNUP_ALERT_USER');
        const salt = this.config.get<string>('SECRET');
        const { name, password, email, phone, role } = signupRequestDto;

        if (IdBlackList.includes(name)) throw new BadRequestException(new InvalidMember());

        const findMember = await this.repository.member.findFirst({
            where: {
                name,
                email,
            },
        });
        if (findMember) throw new ConflictException(new ExistingMember());

        const newMember = await this.repository.member.create({
            data: {
                name,
                email,
                hashedPassword: MemberDomain.generateHashedPassword(password, salt),
                phone,
                role,
            },
        });

        this.eventBus.publish(new SignupEvent(email, name, phone, emails));

        return SignupResponseDto.toDto(newMember);
    }

    async findAll() {
        return FindAllMemberResponseDto.toDto(await this.repository.member.findMany());
    }
}
