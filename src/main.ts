import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { swaggerSetup } from '~/global/config/swagger/swagger.config';
import { AllExceptionFilter } from '~/global/filter/all.exception.filter';
import { DefaultExceptionFilter } from '~/global/filter/default.exception.filter';
import { HttpLoggingInterceptor } from '~/global/interceptor/http.logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.SERVER_PORT) || 3000;
    const prefix = 'api';

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true }));
    app.setGlobalPrefix(prefix);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.useGlobalFilters(new AllExceptionFilter(), new DefaultExceptionFilter());

    app.enableCors({
        exposedHeaders: ['Content-Disposition'],
    });

    swaggerSetup(app, prefix);

    await app.listen(port);
}
bootstrap();
