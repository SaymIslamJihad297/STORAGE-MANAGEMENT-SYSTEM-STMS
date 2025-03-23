import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from './components/Home/Home.jsx';
import Login from './components/User/Login/Login.jsx';
import ContextProvider from './context/ContextProvider.jsx';
import SignUp from './components/User/SignUp/SignUp.jsx';
import ForgotPassword from './components/User/ResetPassword/ForgotPassword.jsx';
import Folders from './components/folders/Folders.jsx';
import AddFolder from './components/folders/AddFolder.jsx';
import FolderViewer from './components/folders/folderViewer/FolderViewer.jsx';
import AllImages from './components/folders/FilesViewer/AllImages.jsx';
import AllDocuments from './components/folders/FilesViewer/AllDocuments.jsx';
import AllPdfs from './components/folders/FilesViewer/AllPdfs.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='folders' element={<Folders />} />
      <Route path='add-folder' element={<AddFolder />} />
      <Route path='folder/:folderName' element={<FolderViewer />} />
      <Route path='all-images' element={<AllImages />} />
      <Route path='all-documents' element={<AllDocuments />} />
      <Route path='all-pdfs' element={<AllPdfs />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </ContextProvider>
  </StrictMode>,
)
