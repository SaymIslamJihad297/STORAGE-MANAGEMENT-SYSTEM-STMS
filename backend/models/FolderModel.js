const mongoose = require('mongoose');
const { Schema } = mongoose;

const folderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    folderName: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Folder', folderSchema);