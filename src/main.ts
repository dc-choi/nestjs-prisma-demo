import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { swaggerSetup } from '~/global/config/swagger/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.SERVER_PORT) || 3000;
    const prefix = 'api';

    app.setGlobalPrefix(prefix);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.enableCors({
        exposedHeaders: ['Content-Disposition'],
    });

    swaggerSetup(app, prefix);

    await app.listen(port);
}
bootstrap();
