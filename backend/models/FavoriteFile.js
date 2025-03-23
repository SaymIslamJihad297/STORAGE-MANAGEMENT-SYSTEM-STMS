const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteFileSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileFormat: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = mongoose.model("FavoriteFile", favoriteFileSchema);