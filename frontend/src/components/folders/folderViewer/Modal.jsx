import React from 'react'

const Modal = ({ isOpen, closeModal, fileUrl, fileType }) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            onClick={closeModal}
        >
            <div
                className="bg-white p-6 rounded-lg"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
                {fileType === "image" && <img src={fileUrl} alt="Selected" className="max-w-full h-auto" />}
                {fileType === "pdf" && (
                    <embed src={fileUrl} type="application/pdf" width="100%" height="500px" />
                )}
                {/* {fileType === "document" && <p>Document: <a href={fileUrl} target="_blank" rel="noopener noreferrer">View Document</a></p>} */}
                {fileType === "document" && <iframe src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`} width="800" height="600"></iframe>}

                <button
                    className="fixed bottom-0 z-50 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={closeModal}
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default Modal