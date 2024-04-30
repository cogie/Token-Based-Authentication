const { gql } = require("apollo-server");

module.exports = gql`
  type Message {
    id: ID!
    text: String!
    createdAt: String
    createdBy: String
  }

  input MessageInput {
    username: String!
    text: String!
  }

  type User {
    username: String!
    email: String!
    password: String!
    token: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    message(ID: ID!): Message
    user(id: ID!): User
    getMessage(amount: Int): [Message]
    getMessages: [Message] # Modified line
  }

  type Mutation {
    createMessage(messageInput: MessageInput): Message!
    deleteMessage(ID: ID!): Boolean
    editMessage(ID: ID!, messageInput: MessageInput): Boolean
    registerUser(registerInput: RegisterInput): User!
    loginUser(loginInput: LoginInput): User!
  }
`;
