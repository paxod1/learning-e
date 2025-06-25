import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserProtect from './components/UserProtect';
import Home from './pages/Home';
import ClassVideo from './pages/ClassVideo';
import ChangePass from './pages/ChangePass';
import Aptitude from './pages/Aptitude';
import Login from './pages/Login';
import TaskReply from './components/TaskReply';
import { useDispatch, useSelector } from 'react-redux';
import ProjectHome from './pages/ProjectHome';
import ProjectProtect from './components/ProjectProtect';
import { LogoutData } from './Redux/UserSlice';
import ErrorBoundary from './components/ErrorBoundary';
import ProjectClassVideo from './pages/ProjectClassVideos';


function App() {
  const loginInfo = useSelector((state) => state.userlogin?.LoginInfo?.[0]);
  const id = loginInfo?.pro_stud_id;


  return (
    <ErrorBoundary> 
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<UserProtect />}>
            <Route path='/' element={id ? <ProjectHome /> : <Home />} />
            <Route path='/ClassVideo' element={<ClassVideo />} />
            <Route path='/ChangePass' element={<ChangePass />} />
            <Route path='/Aptitude' element={<Aptitude />} />
            <Route path='/TaskReply' element={<TaskReply />} />
          </Route>
          <Route element={<ProjectProtect />}>
            <Route path='/' element={id ? <ProjectHome /> : <Home />} />
            <Route path='/Class-video' element={id ? <ProjectClassVideo /> : <Home />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
