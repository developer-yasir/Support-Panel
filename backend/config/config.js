module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_for_development',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/supportpanel'
};