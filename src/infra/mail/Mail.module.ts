import { EnvConfig } from "@global/env/Env.config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvConfig, true>) => {
                return {
                    transport: {
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: configService.get<string>("MAIL_USER"),
                            pass: configService.get<string>("MAIL_PASSWORD"),
                        },
                    },
                    defaults: {
                        from: "Choi Dond Chul",
                    },
                    template: {
                        dir: "src/global/templates",
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
        CqrsModule,
    ],
})
export class MailModule {}
