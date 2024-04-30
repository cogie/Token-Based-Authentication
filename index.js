const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

//initialize
dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//DB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
