const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const User = require("../models/User");
const { newFolder, folders, folderFiles, allImages, allDocuments, allPdfs, recentFiles, makeFavorite, favoriteFiles, deleteFile } = require("../controllers/FolderControllers");
const { isLoggedInUser } = require("../middleware/middlewares");
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to store files with correct extensions
const storage = multer.diskStorage({
    destination: "uploads/", // Temporary folder
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop(); // Get correct extension
        // cb(null, `${file.fieldname}-${Date.now()}.${ext}`); // Save with extension
        cb(null, `${file.originalname}.${ext}`); // Save with original name
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload", isLoggedInUser, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("Uploaded File:", req.file); // Debugging

        let { folderName } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Not Logged In!" });
        }

        let user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Storage Used:", user.storageUsed);
        console.log("File Size:", req.file.size);
        console.log("Storage Limit:", user.storageLimit);

        if (user.storageUsed + req.file.size > user.storageLimit) {
            return res.status(403).json({ message: "Storage limit exceeded!" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            public_id: path.basename(req.file.originalname, path.extname(req.file.originalname)),
            folder: `user_files/${user._id}/${folderName}`,
            type: "authenticated",
        }).catch(error => {
            console.error("Cloudinary Upload Error:", error);
            throw new Error("Cloudinary Upload Failed");
        });

        // Update user's storage usage
        user.storageUsed += req.file.size;
        await user.save();

        // Delete temporary file
        fs.unlinkSync(req.file.path);

        res.json({
            filename: req.file.originalname,
            filesize: (req.file.size / 1024).toFixed(2) + " KB",
            fileUrl: result.secure_url,
        });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ message: "File upload failed", error: err.message });
    }
});


// create folder

router.post('/new-folder', isLoggedInUser, newFolder);

// all folders
router.get('/folders', isLoggedInUser, folders);

// get folder files
router.get('/folder-data', isLoggedInUser, folderFiles);

// get all images
router.get('/all-images', isLoggedInUser, allImages);

// get all documents
router.get('/all-documents', isLoggedInUser, allDocuments);

// get all pdf's
router.get('/all-pdfs', isLoggedInUser, allPdfs);

// get recent files.
router.get('/recent-files', isLoggedInUser, recentFiles);
router.post('/make-favorite', isLoggedInUser, makeFavorite);

router.get('/favorite-files', isLoggedInUser, favoriteFiles);


module.exports = router;
