import axios from "axios";
import {store} from './Redux/store'; // ✅ Move to top
import { LogoutData } from './Redux/UserSlice'; // ✅ Move to top

// Function to get the token from localStorage dynamically
const getTokenFromLocalStorage = () => {
  const persistedLoginData = localStorage.getItem("persist:logindata");
  const loginData = persistedLoginData ? JSON.parse(persistedLoginData) : {};
  const loginInfo = loginData.userlogin ? JSON.parse(loginData.userlogin).LoginInfo[0] : null;

  return loginInfo ? loginInfo.token : '';
};

const SampleUrl = 'https://studentsmangement.onrender.com';

// https://studentsmangement.onrender.com
// http://localhost:5000

// Basic request (no token needed)
export const basicRequest = axios.create({
  baseURL: SampleUrl
});

// Token request instance
export const TokenRequest = axios.create({
  baseURL: SampleUrl
});

// ✅ Add request interceptor
TokenRequest.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add response interceptor to handle invalid/expired token
TokenRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("persist:logindata");
      store.dispatch(LogoutData());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
