const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = new mongoose.Schema({
    participants: {
        type: [String],
        required: true
    },
    messages: [messageSchema]
});

//Addmessages
async function addMessage(senderId, receiverId, text) {
    // Check for an existing conversation
    const existingConversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
  
    if (existingConversation) {
      // If conversation exists, add a new message to it
      existingConversation.messages.push({ sender: senderId, receiver: receiverId, text: text });
      const updatedConversation = await existingConversation.save();
      return updatedConversation;
    } else {
      // If conversation doesn't exist, create a new one
      const newConversation = new conversationModel({
        participants: [senderId, receiverId],
        messages: [{ sender: senderId, receiver: receiverId, text: text }],
      });
  
      const savedConversation = await newConversation.save();
      return savedConversation;
    }
}

async function getConversation(userId1, userId2) {
    const conversation = await conversationModel.findOne({ participants: { $all: [userId1, userId2] } });
    return conversation ? conversation.messages : [];
}


const conversationModel = mongoose.model("Conversations", conversationSchema);
module.exports = { addMessage, getConversation };
