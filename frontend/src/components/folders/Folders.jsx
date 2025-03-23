import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/BackendApiInstance';
import { ApiContext } from '../../context/ApiContext';

const Folders = () => {

    const navigate = useNavigate();
    const { LoginChecker, isLoggedIn } = useContext(ApiContext);
    LoginChecker();
    setTimeout(() => {
        if (isLoggedIn === false) {
            navigate("/login");
        }
    }, 50);
    const [allFolders, setAllFolders] = useState(null);

    useEffect(() => {
        const fetchFolders = async () => {
            const response = await api.get('/file/folders');
            setAllFolders(response.data);
        }
        fetchFolders();
    }, [])



    return (
        <div className='text-white min-h-screen bg-black flex'>
            <div className='flex flex-wrap gap-5'>
                {allFolders && allFolders.map((data, index) => {
                    return (
                        <Link key={index} to={`/folder/${data.folderName}`}>
                            <div className='flex flex-col items-center h-fit w-fit'>
                                <i className="fa-solid fa-folder-open text-yellow-400 text-8xl"></i>
                                <p>{data.folderName}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
            <div className='fixed bottom-0 left-[45%] z-50'>
                <Link to={"/add-folder"}>
                    <button className="relative px-7 py-4 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 overflow-hidden shadow-lg shadow-rose-500/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-rose-500/20 blur-xl group-hover:opacity-75 transition-opacity" />
                        <span className="relative flex items-center gap-3">
                            <i className="fa-solid fa-folder-plus"></i>
                            <span className="font-semibold tracking-wide">Add Folder</span>
                        </span>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Folders