import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../../api/BackendApiInstance';
import { ApiContext } from '../../../context/ApiContext'
import AddSomething from '../../includes/AddItems';
import Modal from './Modal'; // Import the Modal component

const FolderViewer = () => {
    const navigate = useNavigate();
    const { LoginChecker, isLoggedIn } = useContext(ApiContext);
    LoginChecker();
    setTimeout(() => {
        if (isLoggedIn === false) {
            navigate("/login");
        }
    }, 50);

    const { folderName } = useParams();
    const [folderData, setFolderData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // To store selected file
    const [fileType, setFileType] = useState(""); // To store file type (image, document, pdf)
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [menuOpen, setMenuOpen] = useState(null);

    useEffect(() => {
        const folderData = async () => {
            const response = await api.get('/file/folder-data', { params: { folderName } });
            setFolderData(response.data);
        }
        folderData();
    }, [folderName]);

    const imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const documentTypes = ['doc', 'docx', 'txt'];
    const pdfTypes = ['pdf'];

    // Function to open modal with file URL and type
    const openModal = (fileUrl, type) => {
        setSelectedFile(fileUrl);
        setFileType(type);
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setFileType("");
    };

    const toggleMenu = (index) => {
        setMenuOpen(menuOpen === index ? null : index);
    };

    const makeFavorite = async (fileUrl, fileName, fileFormat) => {
        try {
            await api.post("/file/make-favorite", { url: fileUrl, fileName, fileFormat });
            alert("Added to favorites!");
        } catch (error) {
            console.error("Error adding to favorites:", error);
            alert("Failed to add to favorites.");
        }
    };


    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-xl font-bold mb-4">Folder : {folderName}</h1>

            {folderData ? (
                <div className="grid grid-cols-3 gap-4">
                    {folderData.result.resources.map((data, index) => {
                        const fileUrl = data.url;
                        return (
                            <div key={index} className="border p-4 rounded-lg shadow-lg relative group">
                                {imageTypes.includes(data.format) && (
                                    <p
                                        className="cursor-pointer text-green-500"
                                        onClick={() => openModal(fileUrl, "image")}
                                    >
                                        🖼️ {data.filename}.{data.format}
                                    </p>
                                )}
                                {documentTypes.includes(data.format) && (
                                    <p
                                        className="cursor-pointer text-blue-500"
                                        onClick={() => openModal(fileUrl, "document")}
                                    >
                                        📄 {data.filename}.{data.format}
                                    </p>
                                )}
                                {pdfTypes.includes(data.format) && (
                                    <p
                                        className="cursor-pointer text-red-500"
                                        onClick={() => openModal(fileUrl, "pdf")}
                                    >
                                        📕 {data.filename}.{data.format}
                                    </p>
                                )}

                                {/* Three-dot menu button */}
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                    onClick={() => toggleMenu(index)}
                                >
                                    ⋮
                                </button>

                                {/* Menu options */}
                                {menuOpen === index && (
                                    <div className="absolute top-8 right-2 bg-gray-800 text-white shadow-lg rounded-lg p-2">
                                        <button
                                            className="block w-full text-left px-3 py-1 hover:bg-gray-700"
                                            onClick={() => makeFavorite(fileUrl, data.filename, data.format)}
                                        >
                                            ⭐ Make Favorite
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>Loading folder data...</p>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                closeModal={closeModal}
                fileUrl={selectedFile}
                fileType={fileType}
            />

            <AddSomething folderName={folderName} />
        </div>
    );
};

export default FolderViewer;
