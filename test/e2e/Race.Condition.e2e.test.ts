import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '~/App.module';

describe('race condition test', () => {
    let app: INestApplication;
    let accessToken: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        const result = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
            email: 'ddagae0805@gmail.com',
            password: 'ddagae0805',
        });
        console.log(result.body);
        accessToken = result.body.accessToken;
    });

    it('100개의 재고가 있다고 가정했을 때 300개의 요청이 보내짐.', async () => {
        const orderApi = '/api/v1/orders';
        const orderData = {
            data: [
                {
                    itemId: '1',
                    quantity: 1,
                },
            ],
        };

        const requests = Array.from({ length: 300 }, () =>
            request(app.getHttpServer())
                .post(orderApi)
                .set('Authorization', accessToken)
                .set('Content-Type', 'application/json')
                .send(orderData)
        );

        const results = await Promise.all(requests);

        const successResponses = results.filter((res) => res.status === 201);
        const failureResponses = results.filter((res) => res.status !== 201);

        console.log(`Success: ${successResponses.length}, Failures: ${failureResponses.length}`);

        expect(successResponses.length).toEqual(100); // 재고 100개 제한
        expect(successResponses.length + failureResponses.length).toBe(300);
    });
});
