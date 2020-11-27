const articlesResolver = require('./articles')
const users = require('./users')
const usersResolver = require('./users')
module.exports = {
  Query: {
    ...articlesResolver.Query,
  },

  Mutation: {
    ...usersResolver.Mutation,
    ...articlesResolver.Mutation,
  },
}
