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

  type Like {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    name: String!
    email: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    tag: String
    image: String
    content: String
    category: String!
    user: User!
    likes: [Like]!
    comments: [Comment]!
    createdAt: String!
  }

  # input

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input PostInput {
    title: String!
    tag: String
    image: String
    content: String
    category: String!
  }

  type Query {
    getPosts(category: String): [Post]
    getPost(postId: ID!): Post
  }

  # mutation

  type Mutation {
    # user and authentication releted stuff

    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!

    # article relete stuf

    createPost(post: PostInput): Post!
    deletePost(postId: ID!): String!
    editPost(postId: ID!, post: PostInput): Post!
    createPostComment(postId: ID!, body: String): Post!
    deletePostComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  # Subscription

  type Subscription {
    newPost: Post!
  }
`
