import { AllExceptionFilter } from "@global/filter/AllException.filter";
import { DefaultExceptionFilter } from "@global/filter/DefaultException.filter";
import { HttpLoggingInterceptor } from "@global/interceptor/HttpLogging.interceptor";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./App.module";

import expressBasicAuth from "express-basic-auth";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

const swaggerSetup = (app: INestApplication, prefix: string) => {
    app.use([`/${prefix}/docs`], expressBasicAuth({ challenge: true, users: { admin: "admin" } }));

    const config = new DocumentBuilder()
        .setTitle("Demo API docs")
        .setVersion("1.0")
        .addBearerAuth(
            {
                description: "Bearer Token",
                name: "Authorization",
                type: "http",
                scheme: "bearer",
                bearerFormat: "bearer",
            },
            "Authorization"
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${prefix}/docs`, app, document);
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const prefix = "api/v1";

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true }));
    app.setGlobalPrefix(prefix);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.useGlobalFilters(new AllExceptionFilter(), new DefaultExceptionFilter());

    app.enableCors({
        exposedHeaders: ["Content-Disposition"],
    });

    swaggerSetup(app, prefix);

    await app.listen(3000);
}
bootstrap();
