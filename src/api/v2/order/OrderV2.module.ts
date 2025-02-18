import { Module } from '@nestjs/common';

import { OrderV2Service } from '~/api/v2/order/application/OrderV2.service';
import { OrderV2Controller } from '~/api/v2/order/presentation/OrderV2.controller';
import { MutexModule } from '~/global/common/lock/Mutex.module';

@Module({
    imports: [MutexModule],
    providers: [OrderV2Service],
    controllers: [OrderV2Controller],
})
export class OrderV2Module {}
