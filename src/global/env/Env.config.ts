export interface EnvConfig {
    DATABASE_URL: string;

    SECRET: string;

    ENV: string;

    MAIL_USER: string;
    MAIL_PASSWORD: string;
    MAIL_REGISTER_ALERT_USER: string;

    REDIS_URL: string;
}
