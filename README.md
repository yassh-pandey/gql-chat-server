# gql-chat-server
A simple chat app server powered by GraphQL and Node.js

## NOTE:
In order to run this server you should have postgresql installed on your system and an instance of the db running. 
Then go into the root folder of this project and create a config folder there. Inside that folder create two files:
- config.json 
- env.json 

Refer this link to know how **config.json** should look like: [Check Configuration section](https://sequelize.org/master/manual/migrations.html) 

Whereas **env.json** will look something like this: 
```
{
    "JWT_SECRET": "your_jwt_secret_string_goes_here" 
}
```
