import { swaggerSetup } from "@global/config/swagger/Swagger.config";
import { AllExceptionFilter } from "@global/filter/AllException.filter";
import { DefaultExceptionFilter } from "@global/filter/DefaultException.filter";
import { HttpLoggingInterceptor } from "@global/interceptor/HttpLogging.interceptor";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./App.module";

import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.SERVER_PORT) || 3000;
    const prefix = "api";

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true }));
    app.setGlobalPrefix(prefix);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.useGlobalFilters(new AllExceptionFilter(), new DefaultExceptionFilter());

    app.enableCors({
        exposedHeaders: ["Content-Disposition"],
    });

    swaggerSetup(app, prefix);

    await app.listen(port);
}
bootstrap();
