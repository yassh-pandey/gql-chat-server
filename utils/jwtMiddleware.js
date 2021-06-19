const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/env.json");

module.exports = function(context){
    if(context?.req?.headers?.authorization){
        const token = context?.req?.headers?.authorization?.slice("Bearer ".length);
        jwt.verify(token, JWT_SECRET, (err, decoded)=>{
        if(err){
            return context;
        }
        context.user = decoded;
        })
    }
    return context;
};
