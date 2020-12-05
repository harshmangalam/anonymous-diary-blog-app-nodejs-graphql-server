const { AuthenticationError, UserInputError } = require('apollo-server')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
  Query: {
    async getPosts(_, { category, userId, status, all }) {
      try {
        let post = {
          categoryPosts: [],
          userPosts: [],
          statusPosts: [],
          posts: [],
          categoryAndStatusPosts: [],
        }

        if (category && status) {
          let data = await Post.find({
            category,
            publish_progress: status,
          }).populate('user')

          return {
            ...post,
            categoryAndStatusPosts: data,
          }
        }

        if (category) {
          let data = await Post.find({ category }).populate('user')
          return {
            ...post,
            categoryPosts: data,
          }
        }

        if (userId) {
          let data = await Post.find({ user: userId }).populate('user')
          return {
            ...post,
            userPosts: data,
          }
        }
        if (status) {
          let data = await Post.find({
            publish_progress: status,
          }).populate('user')

          return {
            ...post,
            statusPosts: data,
          }
        }
        if (all) {
          let data = await Post.find().populate('user')
          return {
            ...post,
            posts: data,
          }
        }
        return post
      } catch (err) {
        throw new Error(err)
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId).populate('user')
        if (post) {
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },

  Mutation: {
    async createPost(
      _,
      { post: { category, title, tag, image, content } },
      context,
    ) {
      const user = checkAuth(context)
      try {
        const postData = {
          title,
          image,
          category,
          tag,
          content,
          user: user.id,
          createdAt: new Date().toISOString(),
        }

        const newPost = new Post(postData)

        const post = await newPost.save()

        const filterPost = await Post.findById(post.id).populate('user')
        return filterPost
      } catch (err) {
        throw new Error(err)
      }
    },

    async editPost(
      _,
      { postId, post: { category, title, tag, image, content } },
      context,
    ) {
      const user = checkAuth(context)

      try {
        const postData = {
          title,
          image,
          category,
          tag,
          content,
          user: user.id,
        }

        const post = await Post.findById(postId, postData, {
          new: true,
        }).populate('user')

        return post
      } catch (err) {
        throw new Error(err)
      }
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context)
      try {
        const post = await Post.findById(postId)
        if (!post) {
          throw new Error('Post not found')
        }

        if (post.user == user.id || user.isAdmin) {
          await Post.findByIdAndDelete(postId)
          return 'Post deleted Sucessfully'
        } else {
          return new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },

    async createPostComment(_, { postId, body }, context) {
      const { name, email } = checkAuth(context)

      if (body.trim() === '') {
        throw new UserInputError('Empty Comment', {
          errors: {
            body: 'Comment body must not be empty',
          },
        })
      }
      try {
        const post = await Post.findById(postId).populate('user')
        if (post) {
          post.comments.unshift({
            body,
            name,
            email,
            createdAt: new Date().toISOString(),
          })

          await post.save()
          context.pubsub.publish('NEW_POST', {
            newPost: post,
          })
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },

    async deletePostComment(_, { postId, commentId }, context) {
      const { email } = checkAuth(context)
      try {
        const post = await Post.findById(postId).populate('user')
        if (post) {
          const commentIndex = post.comments.findIndex(
            (comment) => comment.id == commentId,
          )
          if (post.comments[commentIndex].email === email) {
            post.comments.splice(commentIndex, 1)
            await post.save()
            return post
          } else throw new UserInputError('Method not allowed')
        } else throw new Error('Post not found')
      } catch (err) {
        throw new Error(err)
      }
    },

    async likePost(_, { postId }, context) {
      const { name, email } = checkAuth(context)

      try {
        const post = await Post.findById(postId).populate('user')
        if (post) {
          if (post.likes.find((like) => like.email === email)) {
            post.likes = post.likes.filter((like) => like.email !== email)
          } else {
            post.likes.push({
              name,
              email,
              createdAt: new Date().toISOString(),
            })
          }

          await post.save()
          return post
        } else throw new Error('Post not found')
      } catch (err) {
        throw new Error(err)
      }
    },

    // admin

    async changePostStatus(_, { postId, status }, context) {
      const { email } = checkAuth(context)

      try {
        const post = await Post.findById(postId).populate('user')
        if (post) {
          post.publish_progress = status
          await post.save()
          return post
        } else throw new Error('Post not found')
      } catch (err) {
        throw new Error(err)
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
}
