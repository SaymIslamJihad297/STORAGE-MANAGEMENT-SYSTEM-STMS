import React, { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../context/ApiContext'
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../includes/Navbar';
import api from '../../api/BackendApiInstance';
import Modal from '../folders/folderViewer/Modal';


const Home = () => {
    const navigate = useNavigate();
    const { LoginChecker, isLoggedIn, userData, setUserData, getUserDataApi, allDocumentData, allImageData, allPdfData, callData } = useContext(ApiContext);

    useEffect(() => {
        LoginChecker();
        if (!isLoggedIn) {
            setTimeout(() => navigate("/login"), 50);
        }
    }, [isLoggedIn, navigate]);

    const [recentUploadedtFiles, setRecentUploadedFiles] = useState([]);
    const [favoriteFilesData, setFavoriteFilesData] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userInfo = async () => {
        try {
            const response = await api.get(getUserDataApi);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error.message);
        }
    };

    const recentlyUploadedFiles = async () => {
        try {
            const response = await api.get('/file/recent-files');
            if (response.status === 200) {
                setRecentUploadedFiles(response.data);
            } else {
                console.error("Error fetching recent files");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFavoriteFiles = async () => {
        try {
            const response = await api.get('/file/favorite-files');
            setFavoriteFilesData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        userInfo();
        callData();
        recentlyUploadedFiles();
        fetchFavoriteFiles();
    }, []);

    const openModal = (fileUrl, type) => {
        setSelectedFile(fileUrl);
        setFileType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setFileType("");
    };

    const imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const documentTypes = ['doc', 'docx', 'txt'];
    const pdfTypes = ['pdf'];

    return (
        <div className='bg-black min-h-screen text-white'>


            <div className='flex justify-center'>
                <div className="group relative flex w-85 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
                    <div className="absolute inset-px rounded-[11px] bg-slate-950" />
                    <div className="relative">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-white">Storage Statistics</h3>
                            </div>
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Live
                            </span>
                        </div>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-slate-900/50 p-3">
                                <p className="text-xs font-medium text-slate-400">Usages Storage</p>
                                <p className="text-lg font-semibold text-white"><i className="fa-solid fa-database"></i>{userData.storageUsed}</p>
                                <span className="text-xs font-medium text-emerald-500">{userData.usagePercentage}</span>
                            </div>
                            <div className="rounded-lg bg-slate-900/50 p-3">
                                <p className="text-xs font-medium text-slate-400">Your Storage</p>
                                <p className="text-lg font-semibold text-white">{userData.storageLimit}</p>
                                <span className="text-xs font-medium text-emerald-500">Available storage: {userData.remainingStorage}</span>
                            </div>
                            <Link to="/folders">
                                <div className="rounded-lg bg-slate-900/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Folders</p>
                                    <p className="text-lg font-semibold text-yellow-400"><i className="fa-solid fa-folder"></i></p>
                                    <span className="text-xs font-medium text-emerald-500">Total Folders: {userData.Total_Folders}</span>
                                </div>
                            </Link>
                            <Link to="/all-documents">
                                <div className="rounded-lg bg-slate-900/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Documents</p>
                                    <p className="text-lg font-semibold text-blue-400"><i className="fa-solid fa-file-invoice"></i></p>
                                    <span className="text-xs font-medium text-emerald-500">
                                        Total Documents: {allDocumentData?.documents?.length || 0}
                                    </span><br />
                                    <span className="text-xs font-medium text-emerald-500">
                                        Storage Used: {allDocumentData?.storageUsed || 0}MB
                                    </span>
                                </div>
                            </Link>
                            <Link to="/all-images">
                                <div className="rounded-lg bg-slate-900/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Images</p>
                                    <p className="text-lg font-semibold text-green-400"><i className="fa-solid fa-image"></i></p>
                                    <span className="text-xs font-medium text-emerald-500">
                                        Total Images: {allImageData?.images?.length || 0}
                                    </span><br />
                                    <span className="text-xs font-medium text-emerald-500">
                                        Storage Used: {allImageData?.storageUsed || 0}MB
                                    </span>
                                </div>
                            </Link>
                            <Link to="/all-pdfs">
                                <div className="rounded-lg bg-slate-900/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">PDF</p>
                                    <p className="text-lg font-semibold text-red-400"><i className="fa-solid fa-file-pdf"></i></p>
                                    <span className="text-xs font-medium text-emerald-500">
                                        Total PDF's: {allPdfData?.pdfs?.length || 0}
                                    </span><br />
                                    <span className="text-xs font-medium text-emerald-500">
                                        Storage Used: {allPdfData?.storageUsed || 0}MB
                                    </span>
                                </div>
                            </Link>

                        </div>
                        <div className="mb-4 h-24 w-full overflow-hidden rounded-lg bg-slate-900/50 p-3">
                            <div className="flex h-full w-full items-end justify-between gap-1">
                                <div className="h-[40%] w-3 rounded-sm bg-indigo-500/30">
                                    <div className="h-[60%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
                                </div>
                                <div className="h-[60%] w-3 rounded-sm bg-indigo-500/30">
                                    <div className="h-[40%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
                                </div>
                                <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
                                    <div className="h-[80%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
                                </div>
                                <div className="h-[45%] w-3 rounded-sm bg-indigo-500/30">
                                    <div className="h-[50%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
                                </div>
                                <div className="h-[85%] w-3 rounded-sm bg-indigo-500/30">
                                    <div className="h-[90%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
                                </div>
                                <div className="h-[65%] w-3 rounded-sm bg-indigo-500/30">
                                    <div className="h-[70%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
                                </div>
                                <div className="h-[95%] w-3 rounded-sm bg-indigo-500/30">
                                    <div className="h-[85%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400">Last 7 days</span>
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <button className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600">
                                View Details
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='fixed bottom-0 left-[45%] z-50'>
                <Link to={"/folders"}>
                    <button className="relative px-7 py-4 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 overflow-hidden shadow-lg shadow-rose-500/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-rose-500/20 blur-xl group-hover:opacity-75 transition-opacity" />
                        <span className="relative flex items-center gap-3">
                            <i className="fa-solid fa-folder"></i>
                            <span className="font-semibold tracking-wide">Folders</span>
                        </span>
                    </button>
                </Link>
            </div>


            <div className='min-h-full mt-10 flex flex-col items-center'>
                <h1 className='text-2xl font-extrabold underline'>Recent</h1>
                <div className="bg-black border p-2 border-green-300 w-fit h-fit rounded-lg mt-10">
                    <div className="flex p-2 gap-1">
                        <div>
                            <span className="bg-teal-500 inline-block center w-3 h-3 rounded-full" />
                        </div>
                        <div className="circle">
                            <span className="bg-orange-500 inline-block center w-3 h-3 rounded-full" />
                        </div>
                        <div className="circle">
                            <span className="bg-indigo-500 box inline-block center w-3 h-3 rounded-full" />
                        </div>
                    </div>
                    <div className="card__content">
                        {recentUploadedtFiles ?
                            <div className='flex flex-col gap-5'>
                                {recentUploadedtFiles?.recentFiles?.map((data, index) => {
                                    const fileUrl = data.url; // URL of the file, use whatever key corresponds to the file URL
                                    return (
                                        <div key={index} className="border p-4 rounded-lg shadow-lg">
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
                                        </div>
                                    );
                                })}

                            </div> : <p>null</p>
                        }
                    </div>


                </div>
            </div>
            <div className='min-h-[50vh] mt-10 flex flex-col items-center'>
                <h1 className='text-2xl font-extrabold underline'>Favorite Files</h1>
                <div className="bg-black border p-2 border-green-300 w-fit h-fit rounded-lg mt-10">
                    <div className="flex p-2 gap-1">
                        <div>
                            <span className="bg-teal-500 inline-block center w-3 h-3 rounded-full" />
                        </div>
                        <div className="circle">
                            <span className="bg-orange-500 inline-block center w-3 h-3 rounded-full" />
                        </div>
                        <div className="circle">
                            <span className="bg-indigo-500 box inline-block center w-3 h-3 rounded-full" />
                        </div>
                    </div>
                    <div className="card__content">
                        {favoriteFilesData ?
                            <div className='flex flex-col gap-5'>
                                {favoriteFilesData?.favoriteFiles.map((data, index) => {
                                    const fileUrl = data.url;
                                    return (
                                        <div key={index} className="border p-4 rounded-lg shadow-lg">
                                            {imageTypes.includes(data.fileFormat) && (
                                                <p
                                                    className="cursor-pointer text-green-500"
                                                    onClick={() => openModal(fileUrl, "image")}
                                                >
                                                    🖼️ {data.fileName}.{data.fileFormat}
                                                </p>
                                            )}
                                            {documentTypes.includes(data.fileFormat) && (
                                                <p
                                                    className="cursor-pointer text-blue-500"
                                                    onClick={() => openModal(fileUrl, "document")}
                                                >
                                                    📄 {data.fileName}.{data.fileFormat}
                                                </p>
                                            )}
                                            {pdfTypes.includes(data.fileFormat) && (
                                                <p
                                                    className="cursor-pointer text-red-500"
                                                    onClick={() => openModal(fileUrl, "pdf")}
                                                >
                                                    📕 {data.fileName}.{data.fileFormat}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}

                            </div> : <p>null</p>
                        }
                    </div>


                </div>
            </div>
            {isLoggedIn &&
                <Modal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    fileUrl={selectedFile}
                    fileType={fileType}
                />
            }
        </div>
    )
}

export default Home