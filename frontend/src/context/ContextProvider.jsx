import React, { useEffect, useState } from 'react';
import { ApiContext } from './ApiContext';
import axios from 'axios';
import api from '../api/BackendApiInstance'

const ContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userData, setUserData] = useState({});
    const [allImageData, setAllImageData] = useState(null);
    const [allDocumentData, setAllDocumentData] = useState(null);
    const [allPdfData, setAllPdfData] = useState(null);
    const getUserDataApi = '/user-data';
    const LoginApi = '/login';
    const SignUpApi = '/signup';
    const forgotPasswordOtpSendApi = '/forgot-password';
    const LoginChecker = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/isAuthenticated`, { withCredentials: true });
            setIsLoggedIn(response.data);  // State update
        } catch (error) {
            console.log("Error checking login status:", error);
        }
    };

    const fetchAllImagesData = async () => {
        const data = await api.get('/file/all-images');
        setAllImageData(data.data);
    }
    const fetchAllDocumentsData = async () => {
        const data = await api.get('/file/all-documents');
        setAllDocumentData(data.data);
    }
    const fetchAllPdfsData = async () => {
        const data = await api.get('/file/all-pdfs');
        setAllPdfData(data.data);
    }

    const callData = () => {
        fetchAllImagesData();
        fetchAllDocumentsData();
        fetchAllPdfsData();
    }
    useEffect(() => {
        callData();
    }, []);

    return (
        <ApiContext.Provider value={{ isLoggedIn, setIsLoggedIn, LoginChecker, LoginApi, SignUpApi, forgotPasswordOtpSendApi, userData, setUserData, getUserDataApi, allDocumentData, allImageData, allPdfData, callData }}>
            {children}
        </ApiContext.Provider>
    );
};

export default ContextProvider;
