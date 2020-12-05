const { gql } = require('apollo-server')

module.exports = gql`
  # types

  type User {
    id: ID!
    name: String!
    email: String!
    token: String!
    isAdmin: Boolean!
    createdAt: String!
  }

  type GetUser {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    isAdmin: Boolean!
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
    user: GetUser!
    likes: [Like]!
    comments: [Comment]!
    createdAt: String!
    publish_progress: String!
  }

  type TrendingPic {
    id: ID!
    title: String
    image: String
    createdAt: String!
    publish_progress: String!
    user: GetUser!
  }

  type GetPost {
    posts: [Post]
    categoryPosts: [Post]
    userPosts: [Post]
    statusPosts: [Post]
    categoryAndStatusPosts: [Post]
  }

  type GetTrendingPic {
    userTrendingPics: [TrendingPic]
    allTrendingPics: [TrendingPic]
    statusTrendingPics: [TrendingPic]
  }

  # input

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input PostInput {
    title: String
    tag: String
    image: String
    content: String
    category: String!
  }

  type Query {
    getPosts(
      category: String
      userId: ID
      status: String
      all: Boolean
    ): GetPost
    getPost(postId: ID!): Post
    getUsers: [GetUser]
    getUser(userId: ID!): GetUser

    getTrendingPic(all: Boolean, userId: ID, status: String): GetTrendingPic
  }

  # mutation

  type Mutation {
    # User
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    deleteUser(userId: ID!): String!
    changePassword(newPassword: String!): GetUser!
    editProfile(name: String!, email: String!): GetUser!

    # posts
    createPost(post: PostInput): Post!
    deletePost(postId: ID!): String!
    editPost(postId: ID!, post: PostInput): Post!
    createPostComment(postId: ID!, body: String): Post!
    deletePostComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    changePostStatus(postId: ID!, status: String!): Post!

    # trending pics
    addTrendingPic(title: String, image: String!): TrendingPic
    deleteTrendingPic(picId: ID!): String!
    changeTrendingPicStatus(picId: ID!, status: String!): TrendingPic!
  }

  # Subscription

  type Subscription {
    newPost: Post!
  }
`
