const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require('./models/user')
const MessageModel = require('./models/messageModel')
const { addMessage, getConversation } = require('./models/messageModel')
const FriendReqModel = require('./models/friendreq')
const axios = require('axios')
const dotenv = require('dotenv'); // Add this line

dotenv.config(); // Add this line

const app = express()

const port = 3001
const url = 'http://localhost:' + port + "/"
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Update this line





////////////////////////////
//// GENERAL
////////////////////////////

app.post("/login", (req, res) =>{ // API endpoint
    const {name, pw} = req.body;
    UserModel.findOne({name:name})
    .then(user => {
        if(user) {
            if(user.pw === pw){
                res.json(
                    {status:"Success",
                    name:user.name,
                    id: user._id})
            } else{
                res.json(
                    {status:"Wrong Password",
                    user: null})
            }
        } else{
            res.json(
                {status:"No User Exists",
                    user: null}
            )
        }
    })
})

app.post('/register', (req, res) =>{ // request, response
    const {name, pw, color} = req.body

    UserModel.findOne({name:name})
    .then(user => {
        if(user) {
            res.json({
                status: "Failure",
                user: null
            })
        } else{
            UserModel.create({name,pw, color, count:0})
            .then(user => res.json({
                status: "Success",
                user: user}))
            .catch(err => res.json(err))
        }
    })
})

////////////////////////////
//// MESSAGE-RELATED
////////////////////////////

app.get('/getConversation/:userId1/:userId2', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        
        const conversation = await MessageModel.getConversation(userId1, userId2);

        if (conversation) {
            res.status(200).json({ message: 'Conversation retrieved successfully', data: conversation });
        } else {
            res.status(404).json({ message: 'Conversation not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/sendMessage', async (req, res) => {
    const { senderId, receiverId, text } = req.body;
    try {
        const newMessage = await addMessage(senderId, receiverId, text);
        res.status(200).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
});

////////////////////////////
//// FRIENDS-RELATED
////////////////////////////

app.get('/checkFriends', (req, res) => {
    try {
        const person1 = req.query.person1;
        const person2 = req.query.person2;
        FriendReqModel.findOne({
            $or: [
                {friender: person1, recipient: person2, accepted: true},
                {friender: person2, recipient: person1, accepted: true}
            ]
        })
        .then(friendship => {
            var result = false;
            if (friendship) { result = true; }
            res.json({results: result})
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/getFriendsList/:user', async (req, res) => {
    try {
        const user = req.params.user;
        FriendReqModel.find({
            $or: [
                {friender: user, accepted: true},
                {recipient: user, accepted: true}
            ]
        })
        .then(friendsList => {
            res.json({friends: friendsList})
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/getIncomingFriendRequests/:user', async (req, res) => {
    try {
        const user = req.params.user;
        FriendReqModel.find({recipient: user,accepted: false})
        .then(friendRequests => {
            res.json({friendRequests: friendRequests})
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/getOutgoingFriendRequests/:user', async (req, res) => {
    try {
        const user = req.params.user;
        FriendReqModel.find({friender: user,accepted: false})
        .then(friendRequests => {
            res.json({friendRequests: friendRequests})
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/acceptFriendRequest', async (req, res) => {
    try {
        const {friender, recipient} = req.body;
        const update = {accepted: true};
        // Use Mongoose to update the bio field for the specified user
        const updatedUser = await FriendReqModel.findOneAndUpdate({
            $or: [
                {friender: friender, recipient: recipient, accepted: false},
                {friender: recipient, recipient: friender, accepted: false}
            ]
        },
        update
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'Incoming friend request not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/sendFriendRequest', (req, res) => {
    const {friender, recipient} = req.body;
    FriendReqModel.findOne({
        $or: [
            {friender: friender, recipient: recipient},
            {friender: recipient, recipient: friender}
        ]
    })
    .then(friendship => {
        if (friendship) {
            // USER HAS INCOMING FRIEND REQUEST
            if (!friendship.accepted && friendship.recipient == friender) {
                axios.put(url + 'acceptFriendRequest', {
                    friender: friender,
                    recipient: recipient
                  })
                  .then(
                    res.json({ status: "Success: User " + friender + " has accepted an incoming friend request from " + recipient, friendRequest: friendship})
                  )
                  .catch(function (err) {
                    res.json(err)
                  });
            // USER HAS OUTGOING FRIEND REQUEST
            } else if (!friendship.accepted && friendship.friender == friender) {
                res.json({ status: "Failure: User " + friender + " already has outgoing friend request to " + recipient})
            // USERS ARE ALREADY FRIENDS
            } else {
                res.json({ status: "Failure: Users " + friender + " and " + recipient + " are already friends"})
            }
        // NO FRIENDSHIPS OR FRIEND REQUESTS EXIST
        } else { 
            FriendReqModel.create({friender, recipient})
                    .then(fReq => 
                        res.status(200).json({ status: "Success: Friend request from " + friender + " sent to " + recipient, friendRequest: fReq}))
                    .catch(err => res.json(err))        
        }
    })
    .catch(err => res.json(err))
})

// works for both friend requests and accepted friendships
app.delete('/deleteFriend', async (req, res) => {
    const {person1, person2} = req.body;
    try {
        const deletedDocument = await FriendReqModel.findOneAndDelete({
            $or: [
                {friender: person1, recipient: person2},
                {friender: person2, recipient: person1}
            ]
        });
        if (!deletedDocument) {
          return res.status(404).json({ error: 'Friendship or friend request not found' });
        }
        res.json({ message: 'Friend request deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
  }); 

////////////////////////////
//// USERPROFILE-RELATED
////////////////////////////

app.get('/getUserData', async (req, res) => {
    try {
        const _id = req.query; // Modify the query parameter to "_id"
        const query = _id ? { _id } : {};
        
        const user = await UserModel.findOne(query);
        res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
});

app.get('/getUserId', async (req, res) => {
    try {
        const { name } = req.query;
        const query = name ? { name } : {};
        
        const user = await UserModel.findOne(query);
        res.json({
            id:user._id
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete('/deleteDocument/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameter
    try {
      const deletedDocument = await UserModel.findByIdAndDelete(id);
      if (!deletedDocument) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });


app.put('/updateUserBio/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the user to update from the URL parameter
        const { bio } = req.body; // Get the new bio value from the request body

        // Use Mongoose to update the bio field for the specified user
        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: { bio } }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.put('/updateProfilePicture/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the user to update from the URL parameter
        const { profilepicture } = req.body; // Get the new bio value from the request body

        // Use Mongoose to update the bio field for the specified user
        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: { profilepicture } }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

////////////////////////////
//// OTHER
////////////////////////////

app.listen(port, () =>{ // Start on this port
    console.log("server is running")
})
