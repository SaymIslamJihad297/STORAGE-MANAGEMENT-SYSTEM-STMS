import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import api from '../../api/BackendApiInstance'
import { ApiContext } from '../../context/ApiContext';

const Navbar = () => {

    const { setIsLoggedIn, isLoggedIn } = useContext(ApiContext);

    const LogOutUser = async () => {
        await api.get('/logout');
        setIsLoggedIn(false);
    }
    return (
        <div className='bg-[#fca311] py-5 sticky z-999 top-0 flex justify-between items-center'>
            <Link to="/">
                <h1 className='font-bold ml-5'>STORAGE-MANAGEMENT-SYSTEM</h1>
            </Link>
            {isLoggedIn &&
                <button onClick={LogOutUser} className='bg-black text-white p-2 rounded-md'>
                    LogOut
                </button>
            }
        </div>
    )
}

export default Navbar