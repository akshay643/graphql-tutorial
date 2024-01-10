const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyparser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const { users } = require("./user");
const { todos } = require("./todos");
async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type User {
        id:ID!,
        name:String!,
        username:String
    }

    type Todo{
        id:ID!,
        title:String!,
        completed:Boolean
        user:User
    }
    type Query{
        getTodos: [Todo],
        getAllUsers:[User],
        getUser(id: ID!): User

    }`,
    resolvers: {
      Todo: {
        user: (todo) => users.find((e) => e.id === todo.id),
      },
      Query: {
        getTodos: () => todos,
        getAllUsers: () => users,
        getUser: async (parent, { id }) => users.find((e) => e.id === id),
      },
    },
  });
  app.use(bodyparser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));
  app.listen(8000, () => console.log("Serevr Started at PORT 8000"));
}

startServer();
