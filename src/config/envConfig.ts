import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export const envConfig = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    USER_API_URL: process.env.USER_API_URL,
    URL_REDIRECT_API_URL: process.env.URL_REDIRECT_API_URL,
    URL_GENERATE_API_URL: process.env.URL_GENERATE_API_URL,
    KEYCLOAK_API_URL: process.env.KEYCLOAK_API_URL,
    BASE_URL: process.env.BASE_URL,
}