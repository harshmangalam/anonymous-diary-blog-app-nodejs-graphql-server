const { model, Schema } = require('mongoose')

const postSchema = new Schema({
  title: String,
  tag: String,
  image: String,
  content: String,
  category: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [
    {
      name: String,
      email: String,
      createdAt: String,
    },
  ],

  comments: [
    {
      body: String,
      name: String,
      email: String,
      createdAt: String,
    },
  ],

  createdAt: String,
})

module.exports = model('Post', postSchema)
