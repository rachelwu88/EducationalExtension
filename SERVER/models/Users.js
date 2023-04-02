const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
 
    quizAverage: {
        type: Number,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },
});


const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel;