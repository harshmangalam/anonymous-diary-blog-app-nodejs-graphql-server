const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  createdAt: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

module.exports = model('User', userSchema)
