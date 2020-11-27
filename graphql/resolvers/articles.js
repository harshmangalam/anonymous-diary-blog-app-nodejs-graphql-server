const { AuthenticationError } = require('apollo-server')
const Article = require('../../models/Article')
const checkAuth = require('../../utils/checkAuth')
module.exports = {
  Query: {
    async getArticles() {
      try {
        const articles = await Article.find()
        return articles
      } catch (err) {
        throw new Error(err)
      }
    },

    async getArticle(_, { articleId }) {
      try {
        const article = await Article.findById(articleId)
        if (article) {
          return article
        } else {
          throw new Error('Article not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },

  Mutation: {
    async createArticle(
      _,
      { article: { title, tags, image, content } },
      context,
    ) {
      const user = checkAuth(context)
      try {
        const articleData = {
          title,
          image,
          tags,
          content,
          user: user.id,
          createdAt: new Date().toISOString(),
        }

        const newArticle = new Article(articleData)

        const article = await newArticle.save()
        return article
      } catch (err) {
        throw new Error(err)
      }
    },

    async deleteArticle(_, { articleId }, context) {
      const user = checkAuth(context)

      try {
        const article = await Article.findById(articleId)
        if(!article){
          throw new Error("Article not found")
        }
        console.log(article)
        console.log(user)
        
        if (article.user == user.id) {
          await article.delete()

          return 'Post deleted Sucessfully'
        } else {
          return new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
