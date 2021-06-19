const user = require("./user");
const message = require("./message");

module.exports = {

    Message: {
        createdAt: (parent)=>{
            return parent.createdAt.toISOString();
        }
    },

    Query: {
        ...user.Query,
        ...message.Query,
    },

    Mutation: {
        ...user.Mutation,
        ...message.Mutation,
    }
}