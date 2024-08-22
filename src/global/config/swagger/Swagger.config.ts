import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import expressBasicAuth from "express-basic-auth";

export const swaggerSetup = (app: INestApplication, prefix: string) => {
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
