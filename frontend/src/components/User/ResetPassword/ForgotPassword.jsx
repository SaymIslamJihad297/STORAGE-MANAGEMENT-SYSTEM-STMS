import React, { useContext, useState, useRef } from 'react'
import './ForgotPassword.css'
import { Link, useNavigate } from "react-router-dom";
import { ApiContext } from '../../../context/ApiContext';
import api from '../../../api/BackendApiInstance'

const ForgotPassword = () => {

    const { forgotPasswordOtpSendApi } = useContext(ApiContext);

    const [email, setEmail] = useState('');
    const [emailProcessing, setEmailProcessing] = useState(true);
    const [otpProcessing, setOtpProcessing] = useState(false);
    const [newPasswordProcessing, setNewPasswordProcessing] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(forgotPasswordOtpSendApi, { email });
            setEmailProcessing(false);
            setOtpProcessing(true);
        } catch (error) {
            console.log(error);
        }
    }

    // otp code -------------------------------
    const length = 6;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!isNaN(value) && value.length <= 1) {
            let newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleOtpVerify = async () => {
        const otpString = otp.join("");
        if (otpString.length === length) {
            try {
                const response = await api.post('/verify-otp', { email, otpString });

                if (response.status === 200) {
                    setOtpProcessing(false);
                    setNewPasswordProcessing(true);
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert("Invalid or expired OTP");
            }
        } else {
            alert("Please enter all 6 digits of the OTP.");
        }
    };

    // new password ----------------------
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            const response = await api.post('/reset-password', { email, newPassword })
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/login');
            } else {
                alert(response.data.message);
            }
        } else {
            alert("Password didn't matched");
        }
    }

    return (
        <div className='text-white h-screen flex flex-col justify-center items-center'>
            {emailProcessing &&
                <form onSubmit={handleEmailSubmit} className='flex'>

                    <div className="forgotcard">
                        <div className="forgottools">
                            <div className="forgotcircle">
                                <span className="forgotred forgotbox"></span>
                            </div>
                            <div className="forgotcircle">
                                <span className="forgotyellow forgotbox"></span>
                            </div>
                            <div className="forgotcircle">
                                <span className="forgotgreen forgotbox"></span>
                            </div>
                        </div>
                        <div className="forgotcard__content flex flex-col gap-5 justify-center items-center">
                            <div className="input-group">
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="text" autoComplete="off" className="input"></input>
                                <label className="user-label">Email</label>
                            </div>
                            <button type='submit' className='btn-Forgot'>
                                <div className="svg-wrapper-1">
                                    <div className="svg-wrapper">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                            <path
                                                fill="currentColor"
                                                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                                <span>Send</span>
                            </button>
                        </div>
                    </div>
                </form>
            }
            {otpProcessing &&
                <div className="flex flex-col items-center space-y-4 p-4">
                    <h1 className='text-red-500 font-bold'>Please Check Your spam folder also</h1>
                    <div className="flex space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleOtpVerify}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Verify
                    </button>
                </div>
            }
            {newPasswordProcessing &&
                <form onSubmit={handlePasswordSubmit} className='flex'>

                    <div className="forgotcard">
                        <div className="forgottools">
                            <div className="forgotcircle">
                                <span className="forgotred forgotbox"></span>
                            </div>
                            <div className="forgotcircle">
                                <span className="forgotyellow forgotbox"></span>
                            </div>
                            <div className="forgotcircle">
                                <span className="forgotgreen forgotbox"></span>
                            </div>
                        </div>
                        <div className="forgotcard__content flex flex-col gap-5 justify-center items-center">
                            <div className="input-group">
                                <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} name="text" autoComplete="off" className="input"></input>
                                <label className="user-label">New Password</label>
                            </div>
                            <div className="input-group">
                                <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="text" autoComplete="off" className="input"></input>
                                <label className="user-label">Confirm Password</label>
                            </div>
                            <button type='submit' className='btn-Forgot'>
                                <div className="svg-wrapper-1">
                                    <div className="svg-wrapper">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                            <path
                                                fill="currentColor"
                                                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                                <span>Change</span>
                            </button>
                        </div>
                    </div>
                </form>
            }
            <Link to="/login">
                <p className='font-bold underline'>Back To Login</p>
            </Link>
        </div>
    )
}

export default ForgotPassword