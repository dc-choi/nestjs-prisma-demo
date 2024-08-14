import { EnvConfig } from "@global/env/Env.config";
import { MailerModule } from "@nestjs-modules/mailer";
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
                            user: configService.get("MAIL_USER"),
                            pass: configService.get("MAIL_PASSWORD"),
                        },
                    },
                    defaults: {
                        from: "Choi Dond Chul",
                    },
                };
            },
        }),
        CqrsModule,
    ],
})
export class MailModule {}
