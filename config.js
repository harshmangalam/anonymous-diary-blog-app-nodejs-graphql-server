module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URL :process.env.MONGODB_URL || 'mongodb://localhost:27017/anonymous-diary',
  JWT_SECRET: process.env.JWT_SECRET || "itssecret",
  ADMIN_EMAIL:process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD:process.env.ADMIN_PASSWORD
}
