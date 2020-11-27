const { model, Schema } = require('mongoose')

const articleSchema = new Schema({
  title: String,
  tags: String,
  image: String,
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: String,
})

module.exports = model('Article', articleSchema)
