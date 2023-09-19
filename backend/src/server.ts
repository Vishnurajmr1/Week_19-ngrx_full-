import * as dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import app from './app';
import mongoConnect from './config/connection';

const port: number = Number(process.env.PORT) || 3000;

(async ()=>{
    try {
        await mongoConnect();
        app.listen(port, () => {
            console.log(`Listening on port http://localhost:${port}/`);
        });
    } catch (error) {
        console.error('An error occurred while starting the server:', error);
    }
 })();

