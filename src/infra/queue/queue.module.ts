import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { QueueEvents } from 'bullmq';
import { EnvConfig } from '~/global/config/env/env.config';
import { CREATE_ORDER, ORDER_QUEUE } from '~/infra/queue/queue.symbol';

@Module({
    imports: [BullModule.registerQueue({ name: ORDER_QUEUE })],
    providers: [
        {
            inject: [ConfigService],
            provide: CREATE_ORDER,
            useFactory: async (configService: ConfigService<EnvConfig, true>) => {
                const queueEvents = new QueueEvents(ORDER_QUEUE, {
                    connection: {
                        url: configService.get<string>('REDIS_URL'),
                    },
                });

                await queueEvents.waitUntilReady();

                return queueEvents;
            },
        },
    ],
    exports: [BullModule, CREATE_ORDER],
})
export class QueueModule {}
