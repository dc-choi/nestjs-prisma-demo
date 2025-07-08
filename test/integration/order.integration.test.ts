import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemSaleStatus, MemberRole } from '@prisma/client';

import Joi from 'joi';
import { ClsModule } from 'nestjs-cls';
import { DaoModule } from 'prisma/dao.module';
import { Repository } from 'prisma/repository';
import { OrderService } from '~/api/v1/order/application/order.service';
import { OrderRequestDto } from '~/api/v1/order/domain/dto/order.dto';
import { OrderModule } from '~/api/v1/order/order.module';

describe('order test', () => {
    let module: TestingModule;
    let orderService: OrderService;
    let repository: Repository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env.test',
                    validationSchema: Joi.object({
                        DATABASE_URL: Joi.string().required(),
                        SECRET: Joi.string().required(),
                        ENV: Joi.string().required(),
                    }),
                }),
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
                DaoModule,
                OrderModule,
            ],
        }).compile();

        orderService = module.get<OrderService>(OrderService);
        repository = module.get<Repository>(Repository);
    });

    beforeEach(async () => {
        await repository.item.create({
            data: {
                name: 'test',
                supplyPrice: 1000,
                vat: 0,
                totalPrice: 1000,
                isTaxFree: true,
                stock: 50,
                itemSaleStatus: ItemSaleStatus.ALLOW,
                memberId: 1n,
            },
        });
    });

    afterEach(async () => {
        await repository.$transaction([
            repository.orderItem.deleteMany(),
            repository.order.deleteMany(),
            repository.item.deleteMany(),
        ]);
    });

    afterAll(async () => {
        await module.close();
    });

    it('정상 동작 확인', async () => {
        // given
        const storedItem = (await repository.item.findMany())[0];
        if (!storedItem) throw new Error('Item not found');
        const prevStock = storedItem.stock;
        const quantity = 1;

        const jwtPayload = { memberId: 1n, role: MemberRole.ADMIN };
        const orderData: OrderRequestDto = {
            data: [
                {
                    itemId: storedItem.id,
                    quantity,
                },
            ],
        };

        // when
        await orderService.order(jwtPayload, orderData);

        // then
        const item = await repository.item.findFirst({
            where: { id: storedItem.id },
        });
        if (!item) throw new Error('Item not found');
        const stock = item.stock;

        expect(prevStock - quantity).toBe(stock);
    });
});
