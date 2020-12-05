const { AuthenticationError } = require('apollo-server')
const TrendingPic = require('../../models/TrendingPic')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
  Query: {
    async getTrendingPic(_, { all, userId, status }) {
      const trendingPics = {
        userTrendingPics: [],
        allTrendingPics: [],
        statusTrendingPics: [],
      }
      try {
        if (all) {
          const pics = await TrendingPic.find().populate('user')
          return {
            ...trendingPics,
            allTrendingPics: pics,
          }
        }

        if (userId) {
          const pics = await TrendingPic.find({ user: userId }).populate('user')
          return {
            ...trendingPics,
            userTrendingPics: pics,
          }
        }

        if (status) {
          const pics = await TrendingPic.find({
            publish_progress: status,
          }).populate('user')
          return {
            ...trendingPics,
            statusTrendingPics: pics,
          }
        }

        return {
          ...trendingPics,
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },

  Mutation: {
    async addTrendingPic(_, { title, image }, context) {
      const user = checkAuth(context)
      try {
        const data = {
          title,
          image,
          createdAt: new Date().toISOString(),
          user: user.id,
        }
        const newPic = new TrendingPic(data)

        const pic = await newPic.save()

        const filterPic = await TrendingPic.findById(pic.id).populate('user')
        return filterPic
      } catch (err) {
        console.log(err)
      }
    },

    async deleteTrendingPic(_, { picId }, context) {
      const user = checkAuth(context)
      
      try {
        const pic = await TrendingPic.findById(picId)
        if (!pic) {
          throw new Error('Trending Picture not found')
        }

        if (pic.user == user.id || user.isAdmin) {
          await TrendingPic.findByIdAndDelete(picId)
          return 'pic deleted Sucessfully'
        } else {
          return new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },



    async changeTrendingPicStatus(_, { picId, status }, context) {
      const { email } = checkAuth(context)

      try {
        const pic = await TrendingPic.findById(picId).populate('user')
        if (pic) {
          // todo:: allow only admin to change status 
          pic.publish_progress = status
          await pic.save()
          return pic
        } else throw new Error('Trending Pictures not found')
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
