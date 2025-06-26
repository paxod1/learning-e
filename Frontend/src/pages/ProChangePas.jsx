import React, { useEffect, useState } from 'react';
import './ChangePass.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

function ProChangePas() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
    const navigate = useNavigate();



    async function handleChangePassword() {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const res = await TokenRequest.post('/project/change-password', {
                pro_stud_id: logininfom.pro_stud_id,
                currentPassword,
                newPassword
            });
            toast.success(res.data.message);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || "Password update failed.");
        }
        setLoading(false);
    }

    return (
        <div className="main-container">
            <section className="navbar_main_video">
                <div className="inner_div_nav_video">
                    <div className="leftnav_video">
                        <img src="https://techwingsys.com/tws-logo.png" className="logo_nav_video" alt="logo" />
                    </div>
                    <div className="rightnav_video">
                        <Link to="/" className="menus_right_video">
                            <AiFillHome /> <span className="menus_right_video_text">Home</span>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="update-section">


                {/* Password Update */}
                <div className="update-box">
                    <h3>Change Password</h3>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                    <button onClick={handleChangePassword} disabled={loading}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProChangePas;
