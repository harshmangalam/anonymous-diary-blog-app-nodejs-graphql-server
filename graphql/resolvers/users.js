const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators')
const { JWT_SECRET } = require('../../config')

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '10h' },
  )
}

module.exports = {
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput({ email, password })

      if (!valid) {
        throw new UserInputError('Errors', {
          errors,
        })
      }

      const user = await User.findOne({ email })

      if (!user) {
        errors.general = 'User not  found'
        throw new UserInputError('User not found', {
          errors,
        })
      }

      const matchPassword = await bcrypt.compare(password, user.password)

      if (!matchPassword) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },

    async register(_, { registerInput: { email, name, password } }) {
      // validate user data

      const { errors, valid } = validateRegisterInput({ name, email, password })

      if (!valid) {
        throw new UserInputError('Errors', {
          errors,
        })
      }
      const user = await User.findOne({ email })

      if (user) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'This email is already taken',
          },
        })
      }
      // auth token

      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      })

      const result = await newUser.save()

      const token = generateToken(result)

      return {
        ...result._doc,
        id: result._id,
        token,
      }
    },
  },
}
