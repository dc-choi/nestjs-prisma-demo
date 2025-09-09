import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { DistributedLockInterceptor } from './global/common/lock/DistributedLock.interceptor';

import Redis from 'ioredis';
import Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import { DaoModule } from 'prisma/dao.module';
import { Repository } from 'prisma/repository';
import Redlock from 'redlock';
import { AuthModule } from '~/api/v1/auth/auth.module';
import { MemberModule } from '~/api/v1/member/member.module';
import { OrderModule } from '~/api/v1/order/order.module';
import { OrderV2Module } from '~/api/v2/order/orderV2.module';
import { OrderV3Module } from '~/api/v3/order/orderV3.module';
import { DEFAULT_LOCK_BASE_DELAY, DEFAULT_LOCK_MAX_RETRIES, RED_LOCK } from '~/global/common/lock/DistributedLock';
import { MutexModule } from '~/global/common/lock/mutex.module';
import { EnvConfig } from '~/global/config/env/env.config';
import { winstonTransports } from '~/global/config/logger/winston.config';
import { TokenModule } from '~/global/jwt/token.module';
import { MailModule } from '~/infra/mail/mail.module';
import { QueueModule } from '~/infra/queue/queue.module';

@Module({
    imports: [
        // ENV
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema: Joi.object({
                SERVER_PORT: Joi.number().optional().default(3000),
                DATABASE_URL: Joi.string().required(),
                MYSQL_HOST: Joi.string().required(),
                MYSQL_PORT: Joi.number().required(),
                MYSQL_USER: Joi.string().required(),
                MYSQL_PASSWORD: Joi.string().required(),
                MYSQL_DATABASE: Joi.string().required(),
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
        // BullMQ
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvConfig, true>) => ({
                connection: {
                    url: configService.get<string>('REDIS_URL'),
                },
            }),
        }),
        QueueModule,
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
        OrderV3Module,
    ],
    providers: [
        {
            provide: RED_LOCK,
            useFactory: (redis: Redis) => {
                return new Redlock([redis], {
                    retryCount: DEFAULT_LOCK_MAX_RETRIES,
                    retryDelay: DEFAULT_LOCK_BASE_DELAY,
                });
            },
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: DistributedLockInterceptor,
        },
    ],
    exports: [],
})
export class AppModule {}
