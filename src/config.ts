import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

export const config = {
    server: {
        port: PORT
    }
};