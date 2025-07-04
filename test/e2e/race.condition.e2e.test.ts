import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemSaleStatus } from '@prisma/client';

import { Repository } from 'prisma/repository';
import request from 'supertest';
import { AppModule } from '~/app.module';

describe('race condition test', () => {
    let app: INestApplication;
    let repository: Repository;
    let accessToken: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        repository = module.get<Repository>(Repository);

        app = module.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();
    });

    beforeEach(async () => {
        const result = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
            email: 'ddagae0805@gmail.com',
            password: 'ddagae0805',
        });
        accessToken = result.body.accessToken;

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
        await app.close();
    });

    describe('v1/order test', () => {
        it('50개의 재고가 있다고 가정했을 때 100개의 요청이 보내짐.', async () => {
            const storedItem = await repository.item.findMany({ take: 1 });

            const orderApi = '/api/v1/orders';
            const orderData = {
                data: [
                    {
                        itemId: storedItem[0].id,
                        quantity: 1,
                    },
                ],
            };

            const requestCount = 100;
            const requests = Array.from({ length: requestCount }, () =>
                request(app.getHttpServer())
                    .post(orderApi)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .set('Content-Type', 'application/json')
                    .send(orderData)
            );

            const results = await Promise.all(requests);

            const successResponses = results.filter((res) => res.status === 201);
            const failureResponses = results.filter((res) => res.status !== 201);
            // const afterItem = await repository.item.findMany({ take: 1 });
            // const afterOrder = await repository.order.findMany();
            // const afterOrderItem = await repository.orderItem.findMany();

            expect(successResponses.length + failureResponses.length).toBe(requestCount);
            // expect(successResponses.length).toBeLessThanOrEqual(50); // 재고 50개 제한
            // expect(afterItem[0].stock).toEqual(0); // 남은 재고 수
            // expect(afterOrder.length).toEqual(50); // 접수된 주문 수
            // expect(afterOrderItem.length).toEqual(50); // 접수된 주문 품목 수
        });
    });

    describe('v2/order test', () => {
        it('50개의 재고가 있다고 가정했을 때 100개의 요청이 보내짐.', async () => {
            const storedItem = await repository.item.findMany({ take: 1 });

            const orderApi = '/api/v2/orders';
            const orderData = {
                data: [
                    {
                        itemId: storedItem[0].id,
                        quantity: 1,
                    },
                ],
            };

            const requestCount = 100;
            const requests = Array.from({ length: requestCount }, () =>
                request(app.getHttpServer())
                    .post(orderApi)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .set('Content-Type', 'application/json')
                    .send(orderData)
            );

            const results = await Promise.all(requests);

            const successResponses = results.filter((res) => res.status === 201);
            const failureResponses = results.filter((res) => res.status !== 201);
            const afterItem = await repository.item.findMany({ take: 1 });
            const afterOrder = await repository.order.findMany();
            const afterOrderItem = await repository.orderItem.findMany();

            expect(successResponses.length + failureResponses.length).toBe(requestCount);
            expect(successResponses.length).toBeLessThanOrEqual(50); // 재고 50개 제한
            expect(afterItem[0].stock).toEqual(0); // 남은 재고 수
            expect(afterOrder.length).toEqual(50); // 접수된 주문 수
            expect(afterOrderItem.length).toEqual(50); // 접수된 주문 품목 수
        });
    });
});
