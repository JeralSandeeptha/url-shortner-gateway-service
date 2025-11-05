import './config/envConfig';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from "./utils/logger";
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { envConfig } from './config/envConfig';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());

// If you are using Gateway Service then dont use express.json() / bodyParser
// Use proxy middlware POST handler

// Custom middleware to handle request body for proxy
app.use('/gateway/users', (req: Request, _res: Response, next: NextFunction) => {
  // Store the original body for POST/PUT/PATCH requests
  if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
    (req as any).rawBody = JSON.stringify(req.body);
  }
  next();
});

// Proxy configuration
const userProxyOptions: Options = {
  target: `${process.env.USER_API_URL}`,
  changeOrigin: true,
  pathRewrite: {
    '^/gateway/users': '/', // Remove /gateway/users prefix
  },
  on: {
    proxyReq: (proxyReq, req, _res) => {
      // Handle body for POST requests
      if ((req as any).rawBody && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength((req as any).rawBody));
        proxyReq.write((req as any).rawBody);
      }
    },
    error: (err, _req, res) => {
      console.error('Proxy Error:', err);
      (res as Response).status(500).json({ error: 'Proxy error' });
    }
  }
};

// Proxy API requests - MOVE THIS BEFORE YOUR MAIN ROUTE
app.use('/gateway/users', createProxyMiddleware(userProxyOptions));

// Import and use your routes - AFTER proxy middleware
import appRoute from "./api/routes/app.route";
app.use('/api/v1', appRoute);

// 404 handler
app.use(/(.*)/, (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// start application
app.listen(PORT, () => {
    console.log(`Gateway Service is running on port ${PORT}`);
    logger.info(`Gateway Service is running at http://localhost:${PORT} `);
    logger.info(`Users Service is running at ${envConfig.USER_API_URL}`);
    logger.info(`URL Generate Service is running at ${envConfig.URL_GENERATE_API_URL}`);
    logger.info(`Redirect Service is running at ${envConfig.URL_REDIRECT_API_URL}`);
});

export default app;