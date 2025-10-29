module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_for_development',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  jwtRememberMeExpiration: process.env.JWT_REMEMBER_ME_EXPIRATION || '30d',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/supportpanel'
};