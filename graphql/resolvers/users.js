const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')
const checkAuth = require('../../utils/checkAuth')
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators')
const { JWT_SECRET,ADMIN_EMAIL,ADMIN_PASSWORD } = require('../../config')


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    },
    JWT_SECRET,
    { expiresIn: '10h' },
  )
}

module.exports = {
  Query: {
    async getUsers() {
      const users = await User.find()
      return users
    },

    async getUser(_, { userId }) {
      const user = await User.findById(userId)
      return user
    },
  },
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
        id: user.id,
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

      const hashPassword = await bcrypt.hash(password, 12)

      const userData = {
        name,
        email,
        password: hashPassword,
        createdAt: new Date().toISOString(),
      }

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        userData.isAdmin = true
      }

      const newUser = new User(userData)

      const result = await newUser.save()

      const token = generateToken(result)

      return {
        ...result._doc,
        id: result._id,
        token,
      }
    },

    async deleteUser(_, { userId }, context) {
      const user = checkAuth(context)

      try {
        const findUser = await User.findById(userId)
        if (findUser) {
          if (findUser.id == user.id || user.isAdmin) {
            await User.findByIdAndDelete(userId)
            return 'User Deleted Successfully'
          } else {
            throw new Error('Method not Allowed')
          }
        } else {
          throw new Error('User not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },

    async changePassword(_, { newPassword, currentPassword }, context) {
      if (!newPassword) {
        throw new UserInputError('Password Empty', {
          errors: {
            general: 'Enter New Password',
          },
        })
      }
      const user = checkAuth(context)

      try {
        const userData = await User.findById(user.id)

        if (userData) {
          const hashPassword = await bcrypt.hash(newPassword, 12)
          userData.password = hashPassword
          await userData.save()
          return userData
        } else {
          throw new Error('User not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },

    async editProfile(_, { email, name }, context) {
      const user = checkAuth(context)

      try {
        const userData = await User.findById(user.id)
        if (userData) {
          userData.email = email
          userData.name = name
          await userData.save()
          return userData
        } else {
          throw new Error('User not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
