const { ApolloServer,PubSub } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { PORT ,MONGODB_URL} = require('./config')


const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors:{
    origin:"https://anonymousdiary.netlify.app/"
  },
  context: ({ req }) => ({ req ,pubsub}),
})

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('mongodb connected'))

server.listen(PORT, () => {
  console.log(`graphql server started on port ${PORT} `)
})
