const allowedOrigins = {
  development: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  production: [
    'https://TechTales.com' 
  ]
};

const corsOptions = {
  origin: function (origin, callback) {
    const env = process.env.NODE_ENV || 'development';
    const origins = allowedOrigins[env];
    
   
    if (!origin) return callback(null, true);
    
    if (origins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;