import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import { DaoModule } from 'prisma/dao.module';
import { Repository } from 'prisma/repository';
import { AuthModule } from '~/api/v1/auth/auth.module';
import { MemberModule } from '~/api/v1/member/member.module';
import { OrderModule } from '~/api/v1/order/order.module';
import { OrderV2Module } from '~/api/v2/order/orderV2.module';
import { MutexModule } from '~/global/common/lock/mutex.module';
import { EnvConfig } from '~/global/config/env/env.config';
import { winstonTransports } from '~/global/config/logger/winston.config';
import { TokenModule } from '~/global/jwt/token.module';
import { MailModule } from '~/infra/mail/mail.module';
import { RedisService } from '~/infra/redis/redis.service';

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
        // Redis
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvConfig, true>) => ({
                type: 'single',
                url: configService.get<string>('REDIS_URL'),
            }),
        }),
        // Prisma
        DaoModule,
        // Infra
        MailModule,
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
    providers: [RedisService],
    exports: [RedisService],
})
export class AppModule {}
