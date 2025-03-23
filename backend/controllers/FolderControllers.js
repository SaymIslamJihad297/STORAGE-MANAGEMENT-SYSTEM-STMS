const cloudinary = require("cloudinary").v2;
const { WrapAsync } = require("../middleware/WrapAsync.js");
const Folder = require('../models/FolderModel.js');
const User = require("../models/User.js");
const FavoriteFile = require("../models/FavoriteFile.js");

module.exports.newFolder = async (req, res) => {
    let { folderName } = req.body;
    try {
        const userId = req.user._id;
        const folderPath = `user_files/${userId}/${folderName}`;

        const newFolder = new Folder({ userId, folderName, path: folderPath });
        await newFolder.save();

        res.json({ message: "Folder Created Successfully! " })
    } catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.folders = async (req, res) => {
    let userId = req.user._id;
    let folders = await Folder.find({ userId: userId });
    res.send(folders);
}

module.exports.folderFiles = async (req, res) => {
    let { folderName } = req.query;
    let userId = req.user._id;
    try {
        const folderPath = `user_files/${userId}/${folderName}`;

        const result = await cloudinary.search.expression(`folder:${folderPath}/*`).sort_by("created_at", "desc").execute();

        res.json({ success: true, result });
    } catch (error) {
        res.json({ message: "Failed to fetch files" })
    }
}

module.exports.allImages = async (req, res) => {
    try {
        let user = req.user;

        const folderPath = `user_files/${user._id}/`;

        const result = await cloudinary.search
            .expression(`folder:${folderPath}* AND resource_type:image AND (format:jpg OR format:jpeg OR format:png OR format:gif)`)
            .sort_by("created_at", "desc")
            .execute();

        // Calculate total size (in bytes)
        const totalSizeBytes = result.resources.reduce((sum, file) => sum + file.bytes, 0);

        // Convert to MB for better readability
        const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

        res.json({ success: true, images: result.resources, storageUsed: totalSizeMB });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch images" });
    }
}

module.exports.allDocuments = async (req, res) => {
    try {
        let user = req.user;

        const folderPath = `user_files/${user._id}/`;

        const result = await cloudinary.search
            .expression(`folder:${folderPath}* AND resource_type:raw AND (format:docx OR format:doc OR format:txt)`)
            .sort_by("created_at", "desc")
            .execute();

        const totalSizeBytes = result.resources.reduce((sum, file) => sum + file.bytes, 0);

        // Convert to MB for better readability
        const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

        res.json({ success: true, documents: result.resources, storageUsed: totalSizeMB });
    } catch (error) {

    }
}
module.exports.allPdfs = async (req, res) => {
    try {
        let user = req.user;

        const folderPath = `user_files/${user._id}/`;

        const result = await cloudinary.search
            .expression(`folder:${folderPath}* AND resource_type:image AND (format:pdf)`)
            .sort_by("created_at", "desc")
            .execute();

        const totalSizeBytes = result.resources.reduce((sum, file) => sum + file.bytes, 0);

        // Convert to MB for better readability
        const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

        res.json({ success: true, pdfs: result.resources, storageUsed: totalSizeMB });
    } catch (error) {

    }
}

module.exports.recentFiles = async (req, res) => {
    try {
        let user = req.user;

        const folderPath = `user_files/${user._id}/`;

        const result = await cloudinary.search
            .expression(`folder:${folderPath}* AND (resource_type:image OR resource_type:video OR resource_type:raw)`)
            .sort_by("created_at", "desc")
            .max_results(5)
            .execute();

        res.json({ success: true, recentFiles: result.resources });
    } catch (error) {
        res.status(429).json({ message: "Internal server error", error: error });
    }

}


module.exports.makeFavorite = WrapAsync(async (req, res) => {
    let { url, fileName, fileFormat } = req.body;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ success: false, message: "Invalid URL" });
    }

    let user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found!" });
    }

    let existingFavorite = await FavoriteFile.findOne({ url, user: user._id });
    if (existingFavorite) {
        return res.json({ success: false, message: "Already in favorites" });
    }

    const favoriteFile = new FavoriteFile({ url, fileName, fileFormat, user: user._id });

    await favoriteFile.save();

    user.favorite.push(favoriteFile._id);
    await user.save();

    res.json({ success: true, message: "Added to favorites", favoriteFile });
});



module.exports.favoriteFiles = WrapAsync(async (req, res) => {
    let userId = req.user._id;

    let favoriteFiles = await FavoriteFile.find({ user: userId });

    res.json({ success: true, favoriteFiles: favoriteFiles });
})

