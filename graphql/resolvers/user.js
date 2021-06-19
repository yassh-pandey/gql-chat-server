const { User, Message } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { 
  UserInputError, 
  AuthenticationError 
} = require("apollo-server");
const { JWT_SECRET } = require("../../config/env.json");
const { passwordSchema, passwordSchemaErrorMapper } = require("../../utils/passwordValidation");

module.exports = {
    Query: {

      getUsers: async (_, __, context) => {

        try{
          let userFromJWT = context.user;
          if(!userFromJWT){
            throw new AuthenticationError("Authorization needed to get list of users.");
          }
          const users = await User.findAll({
              where: {
                  userName: {
                      [Op.ne]: userFromJWT?.userName
                }
              }
          });
          return users;
        }
        catch(err){
          console.log(err);
          throw err;
        }

      }, // getUsers Ends

      getMessages: async (_, args, context)=>{
          const { from } = args;
          try{
            if(!context.user){
                throw new AuthenticationError("Authorization needed to get list of messages.");
            }
            const sender = await User.findOne({
                where: {
                    userName: from
                }
            });
            if(!sender){
                throw new UserInputError("Sender does not exist!");
            }
            if(context?.user?.userName === from){
                throw new UserInputError("Cannot get messages sent to yourself as you can't send message to self.");
            }
            const peopleChatting = [from, context?.user?.userName];
            messages = await Message.findAll({
                where: {
                    from: {
                        [Op.in]: peopleChatting,
                    },
                    to: {
                        [Op.in]: peopleChatting,
                    }
                },
                order: [
                    ["createdAt", "ASC"]
                ],
            })
            return messages;
          }
          catch(error){
              console.log(error);
              throw error;
          }

      }, // getMessages Ends

      login: async(_, args)=>{

        const { userName, password } = args; 
        let errors = {};
        if(userName?.trim()?.length===0){
          errors.userName = "username field cannot le left empty."
        }
        if(password?.trim()?.length===0){
          errors.password = "password field cannot le left empty."
        }
        if(Object.keys(errors).length>0){
          throw new UserInputError("Bad user input", {errors});
        }
        try{
          const user = await User.findOne({
            where: {userName}
          });
          if(!user){
            errors.userName = "Incorrect username or password !";
            throw new AuthenticationError("User not found", {errors});
          }
          // Compare password
          const correctPass = await bcrypt.compare(password, user.password);

          if(!correctPass){
            errors.password = "Incorrect username or password !"
            throw new AuthenticationError("Incorrect password", {errors});
          }

          const token = jwt.sign({userName, email: user?.email}, JWT_SECRET, { expiresIn: '7d' });

          return {
            ...user.toJSON(),
            createdAt: user.createdAt.toISOString(),
            token,
          };
        }
        catch(error){
          console.log(error);
          throw error;
        }

      }, // login Ends

    }, // Query Ends

    Mutation: {

      registerUser: async (_, args)=>{

        const { userName, password, confirmPassword, email } = args;
        let errors= {};

        try{

          // Validate input data
          if(typeof userName!=="string" || userName?.trim()?.length===0){
            errors.userName =  "User name cannot be left empty!";
          }

          if(typeof password!=="string" || password?.trim()?.length===0){
            errors.password = "Password field cannot be left empty!";
          }
          else{
            if(!passwordSchema.validate(password)){
              errors.password = "Bad Password";
              errors.badPassword = passwordSchema.validate(password, {list: true}).map(e=>passwordSchemaErrorMapper[e]);
            }
          }

          if(typeof confirmPassword!=="string" || confirmPassword?.trim()?.length===0){
            errors.confirmPassword = "Confirm password field cannot be left empty!";
          }
          if(typeof email!=="string" || email?.trim()?.length===0){
            errors.email = "Email field cannot be left empty";
          }
          if(confirmPassword !== password){
            errors.confirmPassword = "Password and confirm password should match each other";
          }
          if(Object.keys(errors).length!==0){
            throw errors;
          }

          // Encrypt password
          const encryptedPassword = await bcrypt.hash(password, 10);

          // CREATE USER
          const user = await User.create({userName, password: encryptedPassword, email});
          return user;

        }
        catch(error){
          console.log(error);
          if(["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(error?.name)){
            error?.errors?.forEach(e=>{
              if(e.type==="unique violation"){
                errors[e?.path] = `${e?.path?.toLowerCase()} is already taken`;
              }
              else{
                errors[e?.path] = e?.message;
              }
            })
            throw new UserInputError("Encountered error while trying to create new user!", {errors});
          }
          else{
            console.log(error);
            throw new UserInputError("Encountered an error", {errors: error})
          }
        }

      }, // registerUser Ends

    }, // Mutation Ends

  };