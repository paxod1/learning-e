import { basicRequest } from '../AxiosCreate';
import { LoginData } from '../Redux/UserSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const loginUser = async (data, loading) => {
    try {
        const LoginInfo = await basicRequest.post("/student/login", data);
        toast.success("Login Successful!");
        console.log(LoginInfo.data);
        return LoginInfo.data
    } catch (err) {
        console.log('Login error:', err);

        if (err.response) {
            if (err.response.status === 401) {
                loading(false)
                toast.error("Invalid username or password.");
            } else {
                loading(false)
                toast.error("Something went wrong. Please try again.");
            }
        } else {
            loading(false)
            toast.error("Network error. Please try again.");
        }
    }
};
