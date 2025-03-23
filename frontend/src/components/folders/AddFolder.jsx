import React, { useContext, useState } from 'react'
import api from '../../api/BackendApiInstance'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '../../context/ApiContext';

const AddFolder = () => {

    const navigate = useNavigate();
    const { LoginChecker, isLoggedIn } = useContext(ApiContext);
    LoginChecker();
    setTimeout(() => {
        if (isLoggedIn === false) {
            navigate("/login");
        }
    }, 50);


    const [folderName, setfolderName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await api.post("/file/new-folder", { folderName });
        if (response.status === 200) {
            navigate('/folders');
        }
    }

    return (
        <div className='text-white min-h-screen flex'>
            <form onSubmit={handleSubmit} className="flex items-center max-w-lg mx-auto">
                <label className="sr-only" htmlFor="create-folder">Create</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <i className="fa-solid fa-folder-closed"></i>
                    </div>
                    <input required value={folderName} onChange={(e) => setfolderName(e.target.value)} placeholder="Folder Name..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" id="create-folder" type="text" />
                </div>
                <button className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit">
                    Create
                </button>
            </form>
        </div>
    )
}

export default AddFolder