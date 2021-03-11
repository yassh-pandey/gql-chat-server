const { gql } = require("apollo-server");

module.exports = gql`
    type User{
        userName: String!
        email: String!
        createdAt: String!
        token: String
    }
    type Query {
        getUsers: [User]!
        login(userName: String!, password: String!): User!
    }
    type Mutation{
        registerUser(userName: String! email: String! password: String! confirmPassword: String!): User!
    }
`;