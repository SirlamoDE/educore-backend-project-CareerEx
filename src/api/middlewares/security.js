const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


module.exports = function securityMiddleware(app) {
 
    // Trust proxy (important for backend host (Railway))
    app.set('trust proxy', 1);

   
  // Helmet: Set security headers
  app.use(helmet({
    crossOriginResourcePolicy: false, // allows loading assets across origins
  }));

  // CORS: Restrict allowed origins
  const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['*']
  : ['http://localhost:6500', 'http://127.0.0.1:6500', 'http://localhost:5173'];


  app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes('*') || // Allow all origins if '*' is present
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      const msg = `Blocked by CORS: ${origin}`;
      console.warn(msg);
      callback(new Error(msg), false);
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true',
  exposedHeaders: ['Content-Length', 'X-Requested-With', 'Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

}));


  
  // Rate Limiting: prevent abuse
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  });

  app.use(limiter);
};
