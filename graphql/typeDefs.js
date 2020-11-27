const { gql } = require('apollo-server')

module.exports = gql`
  # types

  type User {
    id: ID!
    name: String!
    email: String!
    token: String!
    createdAt: String!
  }

  type Article {
    id: ID!
    title: String!
    tags: String
    image: String
    content: String
    user: User
    createdAt: String!
  }

  # input

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input ArticleInput {
    title: String!
    tags: String
    image: String
    content: String
  }

  type Query {
    getArticles: [Article]
    getArticle(articleId: ID!): Article
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createArticle(article: ArticleInput): Article!
    deleteArticle(articleId: ID!): String
  }
`
