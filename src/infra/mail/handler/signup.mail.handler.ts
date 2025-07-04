import { MailerService } from '@nestjs-modules/mailer';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SignupEvent } from '~/api/v1/member/application/event/signup.event';
import { verboseLogger } from '~/global/config/logger/winston.config';

@EventsHandler(SignupEvent)
export class SignupMailHandler implements IEventHandler<SignupEvent> {
    constructor(private readonly mailerService: MailerService) {}

    handle(event: SignupEvent): void {
        const { email, name, phone, to } = event;

        this.mailerService
            .sendMail({
                to: to.split(','),
                subject: `[회원 유입] ${name}님이 가입하셨습니다.`,
                template: './signup',
                context: {
                    name,
                    email,
                    phone,
                },
            })
            .catch((e) => {
                verboseLogger.error(`[mailerService.sendMail] : ${e}`);
            });
    }
}
