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
  
  publish_progress:{
    type:String,
    enum:["CONFIRM","REJECT","WAIT"],
    default:"WAIT"
  },

  createdAt: String,
})

module.exports = model('Post', postSchema)
