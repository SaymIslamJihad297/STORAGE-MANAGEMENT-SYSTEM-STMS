const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    storageLimit: { // Default 15GB in bytes
        type: Number,
        default: 15 * 1024 * 1024 * 1024
    },
    storageUsed: {
        type: Number,
        default: 0,
    },
    favorite: [{
        type: Schema.Types.ObjectId,
        ref: 'FavoriteFile',
    }],
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true,
    },
})

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);