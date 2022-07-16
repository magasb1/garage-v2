import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
    PORT: number;
    INTERFACE: string;
    TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    REGISTER_PIN: number;
    SALT_ROUND: number;
}

const config: Config = {
    PORT: Number(process.env.PORT) || 3001,
    INTERFACE: process.env.INTERFACE || "0.0.0.0",
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'SomeSecretNooneKnows!69',
    REFRESH_TOKEN_SECRET: process.env.TOKEN_SECRET || 'SomeSuperSecretPhrase!123',
    REGISTER_PIN: Number(process.env.REGISTER_PIN) || 1234,

    SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND) || 12,
}

export default config;