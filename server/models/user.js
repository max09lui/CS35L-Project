const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    pw: String,
    color: String,
    count: Number,
    // count: Number,
    bio: {
        type: String,
        default: 'Enter Bio Here ' // Set your default value here
    },
    profilepicture: {
        type: String,
        default: 'https://www.cs.ucla.edu/wp-content/uploads/cs/eggert-2.jpg' // Set your default value here
    }
    
})

const UserModel = mongoose.model("logins", UserSchema) // logins is name of table in DB
module.exports = UserModel

