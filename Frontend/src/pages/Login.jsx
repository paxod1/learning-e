import React, { useState, useEffect } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../API/ApiCalling';
import { useDispatch, useSelector } from 'react-redux';
import { LoginData } from '../Redux/UserSlice';
import MultiCourse from './MultiCourse';
import MultiProject from './MultiProject';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [multiCourseData, setMultiCourseData] = useState(null);
  var [multiProject, setMultiproject] = useState(null)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginInfo = useSelector((state) => state.userlogin?.LoginInfo);

  useEffect(() => {
    if (loginInfo?.token) {
      navigate('/');
    }
  }, [loginInfo, navigate]);

  async function handleLogin() {
    setLoading(true);

    var response = await loginUser({ username, password }, setLoading);
    console.log(response);

    const data = response;

    if (data.pro_stud_id) {
      if (data.trainingIdArrayProject.length === 0 || data.trainingIdArrayProject.length === 1) {
        dispatch(LoginData(data));
        navigate('/');
        setLoading(false);
      } else {
        setMultiproject(data);
      }

    } else {
      if (data.trainingIdArray.length === 0 || data.trainingIdArray.length === 1) {
        dispatch(LoginData(data));
        navigate('/');
      } else {
        // Show MultiCourse component with data
        setMultiCourseData(data);
      }
    }



    setLoading(false);
  }

  if (multiCourseData) {
    return <MultiCourse data={multiCourseData} />;
  }

  if (multiProject) {
    return <MultiProject data={multiProject} />;
  }


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src="https://techwingsys.com/tws-logo.png" width="250px" height="60px" alt="logo" style={{ marginBottom: '10px' }} />
        </div>

        <input
          className="login-input"
          type="text"
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <div className="loading-spinner_login">
              <div className="spinner_login"></div>
            </div>
          ) : (
            'Log In'
          )}
        </button>
      </div>
      <div className="login-version">Version 1.0.0.0</div>
    </div>
  );
}

export default Login;
