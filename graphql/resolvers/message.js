const { User, Message } = require("../../models");
const { 
  UserInputError, 
  AuthenticationError 
} = require("apollo-server");

module.exports = {
    Message:{
        createdAt: (parent)=>{
            console.log("%c <------------>", "font-size: 2rem; color: red");
            console.log(parent);
            console.log("%c <------------>", "font-size: 2rem; color: red");
            return parent.createdAt.toISOString();
        }
    },

    Query: {

    }, // Query Ends

    Mutation: {

      sendMessage: async (_, args, context)=>{
        const {to, content} = args;
        const { user } = context;
        try{
          if(!user){
            throw new AuthenticationError("Cannot have access to this resource.");
          }
          const reciever = await User.findOne({
            where: {
              userName: to
            }
          });
          if(!reciever){
            throw new UserInputError("Reciever not found!");
          }
          if(reciever?.userName === user.userName){
            throw new UserInputError("Cannot send message to yourself!");
          }
          if(content.trim().length===0){
            throw new UserInputError("Content of message cannot be empty!");
          }
          const message = await Message.create({
            to: to,
            from: user?.userName,
            content: content,
          });
          return {...message.toJSON(), createdAt: message.createdAt.toISOString()};
        }
        catch(error){
          console.log(error);
          throw error;
        }
      }, // sendMessage Ends

    }, // Mutation Ends

  };