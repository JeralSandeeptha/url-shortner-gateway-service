import './config/envConfig';
import express, { Application } from 'express';
import cors from 'cors';
import logger from "./utils/logger";

//import routes
import appRoute from "./api/routes/app.route";
import { envConfig } from './config/envConfig';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', appRoute);

// start application
app.listen(PORT, () => {
    console.log(`Gateway Service is running on port ${PORT}`);
    logger.info(`Gateway Service is running at http://localhost:${PORT} `);
    logger.info(`Users Service is running at ${envConfig.USER_API_URL}`);
    logger.info(`URL Generate Service is running at ${envConfig.URL_GENERATE_API_URL}`);
    logger.info(`Redirect Service is running at ${envConfig.URL_REDIRECT_API_URL}`);
});

export default app;