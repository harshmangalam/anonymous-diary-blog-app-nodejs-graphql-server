const { model, Schema } = require('mongoose')

const trendingPicSchema = new Schema({
  title: String,

  image: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  publish_progress: {
    type: String,
    enum: ['CONFIRM', 'REJECT', 'WAIT'],
    default: 'WAIT',
  },

  createdAt: String,
})

module.exports = model('TrendingPic', trendingPicSchema)
