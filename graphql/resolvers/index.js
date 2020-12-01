const postsResolver = require('./posts')
const users = require('./users')
const usersResolver = require('./users')
module.exports = {
  Query: {
    ...postsResolver.Query,
  },

  Mutation: {
    ...usersResolver.Mutation,
    ...postsResolver.Mutation,
  },

  Subscription: {
    ...postsResolver.Subscription,
  },
}
