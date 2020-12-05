const postsResolver = require('./posts')
const usersResolver = require('./users')
const trendingPicResolver = require('./trendingpic')
module.exports = {
  Query: {
    ...usersResolver.Query,
    ...postsResolver.Query,
    ...trendingPicResolver.Query
  },

  Mutation: {
    ...usersResolver.Mutation,
    ...postsResolver.Mutation,
    ...trendingPicResolver.Mutation
  },

  Subscription: {
    ...postsResolver.Subscription,
  },
}
