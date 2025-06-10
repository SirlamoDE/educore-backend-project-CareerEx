const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

module.exports = function securityMiddleware(app) {
 
    // Trust proxy (important for backend host (Railway))
  app.set('trust proxy', 1);

  // Helmet: Set security headers
  app.use(helmet({
    crossOriginResourcePolicy: false, // allows loading assets across origins
  }));

  // CORS: Restrict allowed origins
  const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [] // still empty for now but any frontend url can be added here
   
  : ['http://localhost:6500', 'http://127.0.0.1:6500', 'http://localhost:5173'];


  app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Not allowed'));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true', // Allow credentials if set
  exposedHeaders: ['Content-Length', 'X-Requested-With', 'Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

}));

  // XSS-clean: Prevent cross-site scripting
  app.use(xss());

  // MongoSanitize: Prevent NoSQL injection
  app.use(mongoSanitize());

  // Rate Limiting: prevent abuse
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });

  app.use(limiter);
};
