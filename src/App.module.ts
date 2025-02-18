import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import { DaoModule } from 'prisma/dao.module';
import { Repository } from 'prisma/repository';
import { AuthModule } from '~/api/v1/auth/Auth.module';
import { MemberModule } from '~/api/v1/member/Member.module';
import { OrderModule } from '~/api/v1/order/Order.module';
import { OrderV2Module } from '~/api/v2/order/OrderV2.module';
import { MutexModule } from '~/global/common/lock/Mutex.module';
import { winstonTransports } from '~/global/config/logger/Winston.config';
import { TokenModule } from '~/global/jwt/Token.module';
import { MailModule } from '~/infra/mail/Mail.module';
import { RedisModule } from '~/infra/redis/Redis.module';

@Module({
    imports: [
        // ENV
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema: Joi.object({
                SERVER_PORT: Joi.number().optional().default(3000),
                DATABASE_URL: Joi.string().required(),
                SECRET: Joi.string().required(),
                ENV: Joi.string().required(),
                MAIL_USER: Joi.string().required(),
                MAIL_PASSWORD: Joi.string().required(),
                MAIL_SIGNUP_ALERT_USER: Joi.string().required(),
                REDIS_URL: Joi.string().required(),
            }),
        }),
        // Logger
        WinstonModule.forRoot({
            transports: winstonTransports,
        }),
        // Transactional
        ClsModule.forRoot({
            global: true,
            middleware: { mount: true },
            plugins: [
                new ClsPluginTransactional({
                    adapter: new TransactionalAdapterPrisma({
                        prismaInjectionToken: Repository,
                    }),
                }),
            ],
        }),
        // Prisma
        DaoModule,
        // Infra
        MailModule,
        RedisModule,
        // Token
        TokenModule,
        // Mutex
        MutexModule,
        // Business Logic
        AuthModule,
        MemberModule,
        OrderModule,
        OrderV2Module,
    ],
    controllers: [],
})
export class AppModule {}
