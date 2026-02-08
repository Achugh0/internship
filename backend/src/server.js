import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectPostgres, connectMongoDB, connectRedis } from './config/database.js';
import logger from './utils/logger.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Student-First Internship Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      internships: '/api/internships',
      students: '/api/students',
      companies: '/api/companies',
      applications: '/api/applications'
    }
  });
});

// Error handling
app.use(errorHandler);

// Database connections (non-blocking)
const startServer = async () => {
  try {
    // Try to connect to databases but don't fail if they're not available
    await Promise.allSettled([
      connectPostgres(),
      connectMongoDB(),
      connectRedis()
    ]);
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
