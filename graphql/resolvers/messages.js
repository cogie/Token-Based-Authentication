const Message = require("../../models/Message");

module.exports = {
  Query: {
    async message(_, { ID }) {
      return await Message.findById(ID); //wait response from mongoose attempt to find the recibe based on the ID, DB
    },
    async getMessages() {
      // Remove ID parameter
      try {
        const messages = await Message.find(); // Fetch all messages
        return messages;
      } catch (error) {
        throw new Error("Failed to get messages", error);
      }
    },
  },

  Mutation: {
    async createMessage(_, { messageInput: { text, username } }) {
      const newMessage = new Message({
        text: text,
        createdBy: username,
        createdAt: new Date().toISOString(),
      });

      const res = await newMessage.save();
      console.log(res);
      return {
        id: res.id,
        ...res._doc,
      };
    },

    async deleteMessage(_, { ID }) {
      const wasDeleted = (await Message.deleteOne({ _id: ID })).deletedCount;
      return wasDeleted;
    },

    //     //to be fixed the syntax/logic.
    //     async editMessage(_, { ID, MessageInput: { text, username } }) {
    //       const wasEdited = (
    //         await Message.updateOne({
    //           text: text,
    //           createdBy: username,
    //         })
    //       ).modifiedCount;
    //       return wasEdited; //1 if something was edited
    //     },
    //   },
    // };

    async editMessage(_, { ID, messageInput: { text, username } }) {
      const updatedMessage = await Message.findByIdAndUpdate(
        ID,
        {
          text: text,
          createdBy: username,
        },
        { new: true }
      );

      if (!updatedMessage) {
        throw new Error("Message not found");
      }

      console.log(updatedMessage);
      return true;
    },
  },
};
