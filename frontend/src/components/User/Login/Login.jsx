import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiContext } from '../../../context/ApiContext';
import api from '../../../api/BackendApiInstance'
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const { LoginApi, isLoggedIn, LoginChecker } = useContext(ApiContext);
    const navigate = useNavigate();
    LoginChecker();
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    })


    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, "_self");
    }
    const handleGithubLogin = () => {
        window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/github`, "_self")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(LoginApi, { email, password });
            setEmail('');
            setPassword('');
            setError(false);
        } catch (error) {
            setError(true);
        }
    }

    return (
        <div className='flex flex-col gap-5 items-center h-screen justify-center'>
            {error && <p className='text-red-500 font-bold underline'>Wrong Email Or Password</p>}
            <form onSubmit={handleSubmit} className='flex flex-col gap-5 bg-[#8d99ae] h-[60vh] px-5 rounded-2xl justify-center items-center'>
                <div className="input-group">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} required type="text" name="text" autoComplete="off" className="input"></input>
                    <label className="user-label">Email</label>
                </div>
                <div className="input-group">
                    <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" name="text" autoComplete="off" className="input"></input>
                    <label className="user-label">Password</label>
                </div>

                <Link to="/forgot-password">
                    <p className='underline'>Forgot Password</p>
                </Link>

                <button type='submit' className="text-xl w-32 h-12 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000">
                    <span className="absolute bg-emerald-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all" />
                    <span className="absolute bg-emerald-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all" />
                    Login
                </button>

                <p>Don't Have Any Account? <span className='font-bold underline'><Link to="/signup">Sign Up</Link></span></p>
            </form>

            <div className='bg-[#ee6c4d] p-5 flex flex-col items-center justify-center gap-2 rounded-2xl'>

                <p className='font-bold'>------Or------</p>

                <button onClick={handleGoogleLogin} className="cursor-pointer text-black flex gap-2 items-center bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200">
                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-6">
                        <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107" />
                        <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00" />
                        <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50" />
                        <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2" />
                    </svg>
                    Continue with Google
                </button>

                <button onClick={handleGithubLogin} className="cursor-pointer text-zinc-200 flex gap-2 items-center bg-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#111] transition-all ease-in duration-200">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 fill-zinc-200">
                        <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.6,5,2.5,9.3,6.9,10.7v-2.3c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9 c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2 c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3 C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3 c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v3.3c4.1-1.3,7-5.1,7-9.5C22,6.1,16.9,1.4,10.9,2.1z" />
                    </svg>
                    Continue with GitHub
                </button>
            </div>

        </div>
    )
}

export default Login