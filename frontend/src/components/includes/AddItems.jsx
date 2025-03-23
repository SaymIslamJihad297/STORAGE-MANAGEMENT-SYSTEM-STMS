import React, { useContext } from 'react'
import { useState } from 'react';
import api from '../../api/BackendApiInstance';
import { Link } from "react-router-dom";
import { ApiContext } from '../../context/ApiContext';

const AddSomething = ({ folderName }) => {

    const { isLoggedIn } = useContext(ApiContext);
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setIsModalOpen(true);
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        if (!file) {
            alert("Please choose a file");
        };
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderName", folderName);

        try {
            const response = await api.post("/file/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                alert("File uploaded successfully!");
            } else {
                alert("Failed to upload file.");
            }

        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file.");
        }
        setIsModalOpen(false);
        setFile(null);
        setIsUploading(false);
    };
    return (
        <div className='fixed bottom-0 left-[45%] z-50'>
            {isLoggedIn &&
                <div className="relative inline-block group">
                    <button className="relative px-7 py-4 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 overflow-hidden shadow-lg shadow-rose-500/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-rose-500/20 blur-xl group-hover:opacity-75 transition-opacity" />
                        <span className="relative flex items-center gap-3">
                            <i className="fa-solid fa-plus"></i>
                            <span className="font-semibold tracking-wide">Add Items</span>
                        </span>
                    </button>
                    <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-4 w-96 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2 z-50">
                        <div className="relative p-6 bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 rounded-2xl border border-rose-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-yellow-500/10 blur-2xl opacity-50" />
                            <div className="relative flex items-start gap-4 mb-4 pb-4 border-b border-gray-700/50">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur-xl">
                                    <i className="text-white text-lg fa-solid fa-folder-open"></i>
                                </div>
                                <Link to="/add-folder">
                                    <div>
                                        <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                                            Create Folder
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">Unlock advanced capabilities</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="relative space-y-4">
                                <div className="space-y-3">
                                    <input type="file" id="pdfInput" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, "pdf")} />
                                    <input type="file" id="docxInput" className="hidden" accept=".docx" onChange={(e) => handleFileChange(e, "docx")} />
                                    <input type="file" id="imageInput" className="hidden" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChange(e, "image")} />

                                    <div className="flex flex-col gap-3">
                                        <label htmlFor="pdfInput" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors cursor-pointer">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-pink-500/20">
                                                <i className="text-white text-lg fa-solid fa-file-pdf"></i>
                                            </div>
                                            <span className="text-sm text-gray-300">Import PDF</span>
                                        </label>

                                        <label htmlFor="docxInput" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors cursor-pointer">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">
                                                <i className="text-white text-lg fa-solid fa-file-word"></i>
                                            </div>
                                            <span className="text-sm text-gray-300">Import DOCX</span>
                                        </label>

                                        <label htmlFor="imageInput" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors cursor-pointer">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/20">
                                                <i className="text-white text-lg fa-solid fa-image"></i>
                                            </div>
                                            <span className="text-sm text-gray-300">Import Image</span>
                                        </label>
                                    </div>

                                    {isModalOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-80">
                                                <p className="mb-4">Upload {file?.name}?</p>
                                                <div className="flex justify-end gap-3">
                                                    <button className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600" onClick={() => { setIsModalOpen(false); setFile(null); }}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className={`px-4 py-2 rounded-lg text-white transition-all duration-300 
                ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                                                        onClick={handleUpload}
                                                        disabled={isUploading} // ✅ Disable button while uploading
                                                    >
                                                        {isUploading ? "Uploading..." : "Upload"}
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                                    <span className="text-xs text-gray-400">Limitless storage Starting from $29/month</span>
                                    <a className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors" href="#">
                                        Go Premium →
                                    </a>
                                </div>
                            </div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/98 to-gray-800/98 rotate-45 border-r border-b border-rose-500/20" />
                        </div >
                    </div >
                </div >
            }
        </div >
    )
}

export default AddSomething