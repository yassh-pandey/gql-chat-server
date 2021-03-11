const { User } = require("../models");
const bcrypt = require("bcrypt");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/env.json");
module.exports = {
    Query: {
      getUsers: async (_, __, context) => {
        try{
          let userFromJWT;
          if(context?.req?.headers?.authorization){
            const token = context?.req?.headers?.authorization?.slice("Bearer ".length);
            jwt.verify(token, JWT_SECRET, (err, decoded)=>{
              if(err){
                throw new AuthenticationError("Not authenticated to access this");
              }
              userFromJWT = decoded;
            })
          }
          const users = await User.findAll();
          return users.filter(u=>u.userName!==userFromJWT.userName);
        }
        catch(err){
          console.log(err);
          throw err;
        }
      },
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

          const token = jwt.sign({userName}, JWT_SECRET, { expiresIn: '1h' });

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
      }
    },
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

          // // Check if the user already exists 
          // const uName = await User.findOne({
          //   where: {userName}
          // });

          // const uEmail = await User.findOne({
          //   where: {email}
          // });

          // if(uName!==null){
          //   errors.userName = "User with this name already exists!";
          // }
          // if(uEmail!==null){
          //   errors.email = "User with this email already exists!";
          // }

          // if(uName!==null || uEmail!==null){
          //   throw errors;
          // }

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
      }
    }
  };