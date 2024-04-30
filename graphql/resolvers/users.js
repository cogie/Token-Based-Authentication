const User = require("../../models/User");
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { username, email, password } }) {
      //look if theres an old email attempting to register
      const oldUser = await User.findOne({ email });

      //Throw error if user exists
      if (oldUser) {
        throw new ApolloError(
          "User already exist with the email " + email,
          "USER_ALREADY_EXIST!"
        );
      }

      //Encrypt password
      var encryptedPass = await bcrypt.hash(password, 10);

      //Build mongoose model (User)
      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPass,
      });

      //JWT
      const token = jwt.sign(
        {
          user_id: newUser._id,
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "3h",
        }
      );

      newUser.token = token;

      //Save user in mongoDB
      const res = await newUser.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },

    //LogIn
    async loginUser(_, { loginInput: { email, password } }) {
      //Look if the user exist with the email
      const user = await User.findOne({ email });

      //Check if entered password === encryptedPass
      if (user && (await bcrypt.compare(password, user.password))) {
        //note
        //Create a New token
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
            username: user.username, //inlcude username to return when logged in 
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "3h",
          }
        );
        //Attach token to user model if found
        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        //User doesn't exist return error
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD");
      }
    },
  },
  Query: {
    //user: (_, { ID }) => User.findByID(ID) / alternate
    async user(_, { id }) {
      return await User.findById(id); //wait response from mongoose attempt to find the user based on the ID, DB
    },
  },
};
