import React, { useEffect, useState } from 'react';
import './ChangePass.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

function ChangePass() {
  const [studentData, setStudentData] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  var [address, setAddress] = useState('')

  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
  const student_id = logininfom?.student_id;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const res = await TokenRequest.get(`/student/getstudent?student_id=${student_id}`);
        console.log(res.data[0]);

        setStudentData(res.data[0]);
        setAddress(res.data[0].address)
      } catch (err) {
        toast.error("Failed to fetch details");
      }
    }
    fetchStudentDetails();
  }, [student_id]);

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await TokenRequest.post('/student/change-password', {
        student_id,
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

  async function handleUpdateDetails() {
    setLoading(true);
    try {
      const res = await TokenRequest.put('/student/updatedata', { address, student_id });
      toast.success(res.data.message || "Updated successfully");
      setLoading(false);
    } catch (err) {
      toast.error("Failed to update details.");
      setLoading(false);
    }
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
        {/* Details Update */}
        <div className="update-box">
          <h3>Update Student Details</h3>

          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Mobile Number:</strong> {studentData.mobile_num}</p>
          <p><strong>WhatsApp Number:</strong> {studentData.whatsp_num}</p>
          <p><strong>Gender:</strong> {studentData.gender}</p>
          <p><strong>Date of Birth:</strong> {studentData.dob}</p>
          <p><strong>Aadhar Number:</strong> {studentData.aadhar_num}</p>
          <p><strong>Guardian's Mobile:</strong> {studentData.guard_num}</p>
          <p><strong>Guardian's Name:</strong> {studentData.gaurdian_name}</p>
          <p><strong>Relation:</strong> {studentData.relation}</p>
          <p><strong>Qualification:</strong> {studentData.qualification}</p>
          <p><strong>Pincode:</strong> {studentData.pincode}</p>

          {/* Editable address input */}
          <label htmlFor="address"><strong>Address:</strong></label>
          <textarea
            type="text"
            id="address"
            value={address || ''}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter new address"
          />

          <button onClick={handleUpdateDetails}>
            {loading ? 'Updating...' : 'Update Address'}
          </button>
        </div>

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

export default ChangePass;
