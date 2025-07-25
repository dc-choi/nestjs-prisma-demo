export interface EnvConfig {
    SERVER_PORT: number;

    DATABASE_URL: string;

    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_DATABASE: string;

    SECRET: string;

    ENV: string;

    MAIL_USER: string;
    MAIL_PASSWORD: string;
    MAIL_SIGNUP_ALERT_USER: string;

    REDIS_URL: string;
}
