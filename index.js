const { ApolloServer,PubSub } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { PORT ,MONGODB_URI} = require('./config')


const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req ,pubsub}),
})

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log('mongodb connected'))

server.listen(PORT, () => {
  console.log(`graphql server started on port ${PORT} `)
})
