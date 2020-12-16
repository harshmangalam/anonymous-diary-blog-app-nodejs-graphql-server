module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URL:
    process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URL
      : 'mongodb://localhost:27017/anonymous-diary',
  JWT_SECRET:
    process.env.NODE_ENV === 'production'
      ? process.env.JWT_SECRET
      : 'itssecret',
  ADMIN_EMAIL:
    process.env.NODE_ENV === 'production'
      ? process.env.ADMIN_EMAIL
      : 'admin@gmail.com',
  ADMIN_PASSWORD:
    process.env.NODE_ENV === 'production'
      ? process.env.ADMIN_PASSWORD
      : 'admin12345',
}
