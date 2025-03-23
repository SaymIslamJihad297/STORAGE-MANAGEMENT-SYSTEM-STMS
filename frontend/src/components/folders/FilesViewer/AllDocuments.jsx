import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../../../context/ApiContext';
import Modal from '../folderViewer/Modal';

const AllDocuments = () => {
    const navigate = useNavigate();
    const { LoginChecker, isLoggedIn, allDocumentData } = useContext(ApiContext);
    LoginChecker();
    setTimeout(() => {
        if (isLoggedIn === false) {
            navigate("/login");
        }
    }, 50);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState("");

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
    return (
        <div className='text-white grid grid-cols-3 gap-4'>
            {allDocumentData && allDocumentData.documents.map((data, index) => {
                const documentUrl = data.url;
                return (
                    <div key={index} className="border p-4 rounded-lg shadow-lg">
                        <div>
                            <p
                                className="cursor-pointer text-green-500"
                                onClick={() => openModal(documentUrl, "document")}
                            >
                                📄 {data.filename}.{data.format}
                            </p>
                        </div>
                    </div>
                )
            })}

            <Modal
                isOpen={isModalOpen}
                closeModal={closeModal}
                fileUrl={selectedFile}
                fileType={fileType}
            />

        </div>
    )
}

export default AllDocuments