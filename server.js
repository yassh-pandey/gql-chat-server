const { ApolloServer } = require('apollo-server');
const { sequelize } = require("./models");

// The GraphQL schema
const typeDefs = require("./graphql/typedefs");

// A map of functions which return data for the schema.
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ctx=>ctx,
});

server.listen().then(async ({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  try{
    await sequelize.authenticate();
    console.log("✔️ Database connected");
  }
  catch(err){
    console.log(`❌ Error connecting to database:`);
    console.log(err);
  }
});