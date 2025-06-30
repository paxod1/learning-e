
import React, { useEffect, useState } from 'react';
import { TokenRequest } from '../AxiosCreate';
import { useSelector } from 'react-redux';
import './Home.css';
import { useDispatch } from 'react-redux'
import { LogoutData } from '../Redux/UserSlice';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import {
  FaCalendarMinus, FaCheckCircle, FaEnvelopeOpen, FaExclamationCircle, FaExclamationTriangle, FaFolderOpen, FaHourglassHalf,
  FaIdCard, FaList, FaRegKeyboard, FaSchool, FaSpinner, FaTasks
} from "react-icons/fa";
import { MdInsertChart } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { FaCalendarCheck } from "react-icons/fa";
import { IoIosCard } from "react-icons/io";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaChrome } from "react-icons/fa";
import { RiCustomerService2Fill, RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { BiLoaderCircle } from "react-icons/bi";
import { BiTask } from "react-icons/bi";
import { FaLaptopCode } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Add from '../components/Add';
import DueDateAlert from '../components/PaymentAlert';
import { PiExamFill } from "react-icons/pi";
import HomePoster from '../components/HomePoster';
import TaskReply from '../components/TaskReply'
import he from 'he';
import { cleanHtml, getShortHtml, getShortHtmlLength } from '../components/cleanText';
import ViewAnnou from '../components/ViewAnnou';
import ViewAnnouper from '../components/ViewAnnouper';
import { IoIosMailUnread } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { LuBellDot } from "react-icons/lu";
import { BsCoin, BsListTask } from "react-icons/bs";
import ProjectEarn from './ProjectEarn';
import DocUpload from '../components/DocUpload';


/**
 * Main Home component that serves as the dashboard for students
 * Displays various sections like attendance, tasks, projects, announcements, etc.
 */
function ProjectHome() {
  // State declarations
  const [training_id, setTraining_id] = useState(''); // Stores student ID
  const [reviews, setReviews] = useState([]); // Stores student reviews/results
  const [batch, setBatch] = useState([]); // Stores batch details
  const [attendance, setAttendance] = useState([]); // Stores attendance records
  const [filteredAttendance, setFilteredAttendance] = useState([]); // Stores filtered attendance records
  const [bill, setBill] = useState([]); // Stores billing information
  const [activeSection, setActiveSection] = useState('dashboard'); // Tracks currently active section
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedYear, setSelectedYear] = useState(''); // Selected year for attendance filter
  const [selectedMonth, setSelectedMonth] = useState(''); // Selected month for attendance filter
  const [paymentData, setPaymentData] = useState(null) // Stores payment data
  const [batchname, setBatchname] = useState('') // Stores batch name
  const navigate = useNavigate() // Navigation hook
  const [material, setMaterial] = useState([]) // Stores study materials
  const [homeAnnouncement, setHomeAnnouncement] = useState([]) // Stores home announcements
  const [announcement, setAnnouncement] = useState([]) // Stores all announcements
  const [activeMenu, setActiveMenu] = useState(""); // Tracks active menu item
  const [nodata, setNodata] = useState(false) // Flag for no data available
  const [personalAnn, setPersonalAnn] = useState([]) // Stores personal announcements
  const [student, setSutdent] = useState([]) // Stores student details
  const [task, setTask] = useState([]) // Stores tasks
  const [project, setProject] = useState([]) // Stores projects
  var [dueDate, setDueDate] = useState(null) // Stores payment due date
  var [addTime, setAddTime] = useState(false) // Controls ad display
  const [showMore, setShowMore] = useState(false); // Controls 'More' dropdown
  var [taskForm, setTaskForm] = useState(false) // Controls task form display
  const [viewMore, setViewMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('batch');   // Toggle between 'batch' or 'personal'
  const [coinsEarned, setCoinsEarned] = useState();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]); // Gets login info from Redux


  const handleViewMore = (item) => {
    setSelectedItem(item);
  };

  const closeViewMore = () => {
    setSelectedItem(null);
  };


  /**
   * Toggles the 'More' dropdown menu
   */
  const toggleMore = () => {
    setShowMore(prev => !prev);
  };

  /**
   * Shows advertisement after a delay
   */
  function showAd() {
    setTimeout(() => {
      setAddTime(true)
    }, 10000);
  }

  const dispatch = useDispatch()

  /**
   * Handles user logout
   * Dispatches logout action and reloads the page
   */
  async function logout() {
    dispatch(LogoutData())
    setDueDate(null)
    await setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  // Effect to set student ID and show ad when login info changes
  useEffect(() => {
    setLoading(true);
    showAd()
    if (logininfom) {
      setTraining_id(logininfom.trainingIdArrayProject[0]);
    }
  }, [logininfom]);

  var [groupDetails, setGroupDetails] = useState()
  // Effect to fetch bill and student data when training_id or active section changes
  useEffect(() => {

    if (training_id && activeSection === 'dashboard') {

      async function billhome() {
        await fetchData('batchDetails');

        // get bill details
        try {
          let response = await TokenRequest.get(`/project/getBillDetails?project_id=${logininfom.trainingIdArrayProject[0]}`);
          setDueDate(response.data[response.data.length - 1].due_date ? response.data[response.data.length - 1].due_date : null)

          const lastPayment = response.data[response.data.length - 1];

          setPaymentData(lastPayment);
        } catch (error) {
          console.log(error);

        }
        // get student details
        try {
          let response2 = await TokenRequest.get(`/project/getstudent?pro_stud_id=${logininfom.pro_stud_id}`);


          setSutdent(response2.data[0])

        } catch (error) {
          console.log(error);

        }

        // get project details
        try {
          let response = await TokenRequest.get(`/project/getGroupDetails?project_id=${logininfom.trainingIdArrayProject[0]}`);

          setGroupDetails(response.data[0])

        } catch (error) {
          console.log(error);

        }


        const fetchEarnings = async () => {
          try {
            const res = await TokenRequest.get(`/project/earnings?pro_stud_id=${logininfom.pro_stud_id}`);;

            setCoinsEarned(res.data.total_earnings)

          } catch (err) {
            console.error('Fetch error:', err);
          }
        };

        fetchEarnings()
      }

      billhome();
    }

    async function getMailhome() {
      try {
        let generalResponse;

        if (groupDetails.pro_type === 'Single Project') {
          console.log("hi", groupDetails.project_id);

          generalResponse = await TokenRequest.get(`/project/getdataAnnouncementsid?id=${groupDetails.project_id}`);

        } else {
          generalResponse = await TokenRequest.get(`/project/getdataAnnouncementsid?group=${groupDetails.pro_type}`);

        }

        // Handle empty response
        if (!generalResponse.data || generalResponse.data.length === 0) {
          setAnnouncement([]);
          setNodata(true);
        } else {
          setAnnouncement(generalResponse.data);
        }
        // Get the latest 5 announcements and reverse them (if you want most recent at top)
        const generalAnnouncements = generalResponse.data?.slice(-5).reverse() || [];

        const finalAnnouncements = generalAnnouncements.length > 0
          ? generalAnnouncements
          : [{ title: "No announcements", description: "There are no announcements available at this time." }];

        setHomeAnnouncement(finalAnnouncements);


      } catch (error) {
        console.warn("Error in announcement processing:", error);
        setHomeAnnouncement([
          {
            title: "Connection issue",
            description: "Collecting data....."
          }
        ]);
      }

    }

    getMailhome()

  }, [training_id, activeSection, groupDetails]);

  // Current date formatted as YYYY-MM-DD
  if (dueDate) {
    var date = new Date();
    var formattedDate = date.toISOString().split('T')[0];
  }


  /**
   * Fetches data for different sections based on the selected menu item
   * @param {string} section - The section to fetch data for
   */
  const fetchData = async (section) => {
    setActiveMenu(section);
    if (!training_id) return;
    setLoading(true);

    try {
      let response;
      switch (section) {
        case 'batchDetails':
          setActiveSection('batchDetails');
          response = await TokenRequest.get(`/project/getGroupDetails?project_id=${logininfom.trainingIdArrayProject[0]}`);

          setBatch(response.data);

          var group = response.data[0]?.pro_type || 'No Batch Assigned';
          setBatchname(group);



          var statuscheck = ' '

          // Automatically logout if student is marked as DROPPED
          if (statuscheck == 'DROPED') {
            toast.error("Student Droped course!");
            dispatch(LogoutData())
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          }

          break;


        //     case 'reviews':
        //       setActiveSection('reviews');
        //       response = await TokenRequest.get(`/student/getdatareview?student_id=${logininfom.student_id}`);
        //       if (response.data.length === 0) {
        //         setReviews([]);
        //         setActiveSection(' ');
        //         setNodata(true)
        //       } else {
        //         setReviews(response.data);
        //       }
        //       break;

        case 'attendance':
          setActiveSection('attendance');
          response = await TokenRequest.get(`/project/getdataattendance?pro_stud_id=${logininfom.pro_stud_id}&year=${selectedYear}&month=${selectedMonth}`);
          console.log("from attendance>>", response.data);

          if (response.data.length === 0) {
            setAttendance([]);
            setFilteredAttendance([]);
            setActiveSection(' ');
            setNodata(true)
          } else {
            setAttendance(response.data);
            setFilteredAttendance(response.data);
          }
          break;

        case 'bill':
          setActiveSection('bill');
          response = await TokenRequest.get(`/project/getBillDetails?project_id=${logininfom.trainingIdArrayProject[0]}`);
          if (response.data.length === 0) {
            setBill([]);
            setActiveSection(' ');
            setNodata(true)
          } else {
            setBill(response.data);
          }
          break;

        case 'material':
          setActiveSection('material');


          if (groupDetails.pro_type === 'Single Project') {

            const response1 = await TokenRequest.get(`/project/getdatamaterial?id=${groupDetails.project_id}`);

            if (response1.data.length === 0) {
              setMaterial([]);
              setActiveSection(' ');
              setNodata(true)
            } else {
              setMaterial(response1.data);
            }

          } else {

            const response2 = await TokenRequest.get(`/project/getdatamaterial?group=${groupDetails.pro_type}`);
            if (response2.data.length === 0) {
              setMaterial([]);
              setActiveSection(' ');
              setNodata(true)
            } else {
              setMaterial(response2.data);
            }
          }

          break;

        case 'announcement':
          setActiveSection('announcement');
          setLoading(true);
          setNodata(false);


          try {
            if (groupDetails.pro_type === 'Single Project') {


              const response = await TokenRequest.get(`/project/getdataAnnouncementsid?id=${groupDetails.project_id}`);


              if (response.length === 0) {
                setAnnouncement([]);
                setNodata(true);
              } else {
                setAnnouncement(response.data); // Assuming the response data is in response.data
              }
            } else {
              const response = await TokenRequest.get(`/project/getdataAnnouncementsid?group=${groupDetails.pro_type}`);

              if (response.length === 0) {
                setAnnouncement([]);
                setNodata(true);
              } else {
                setAnnouncement(response.data); // Assuming the response data is in response.data
              }
            }
          } catch (error) {
            console.error("Error in announcement processing:", error);
            setNodata(true);
          } finally {
            setLoading(false);
          }
          break;


        case 'Project':
          setActiveSection('Project');

          break;

        //     case 'personalannouncement':
        //       setActiveSection('personalannouncement');
        //       var response5 = await TokenRequest.get(`/student/getdataAnnouncementsid?training_id=${training_id}`);
        //       if (response5.data.length === 0) {
        //         setPersonalAnn([]);
        //         setActiveSection(' ');
        //         setNodata(true)
        //       } else {
        //         setPersonalAnn(response5.data);
        //         console.log(response5.data);
        //       }
        //       break;

        // case 'task':
        //   setActiveSection('task');
        //   response = await TokenRequest.get(`/student/getTasks?training_id=${training_id}`);
        //   if (response.data.length === 0) {
        //     setTask([]);
        //     setActiveSection(' ');
        //     setNodata(true)
        //   } else {
        //     setTask(response.data);
        //   }
        //   break;

        //     case 'tests':
        //       setActiveSection('tests');
        //       break;

        default:
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${section} data:`, err);
    } finally {
      setLoading(false);
    }
  };


  /**
   * Filters attendance records by status
   * @param {string} status - The attendance status to filter by ('all', 'Present', 'Absent')
   */
  const handleAttendanceFilter = (status) => {
    if (status === 'all') {
      setFilteredAttendance(attendance);
    } else {
      const filteredData = attendance.filter(record => record.attendance === status);
      setFilteredAttendance(filteredData);
    }
  };

  /**
   * Handles year selection change for attendance filter
   * @param {Object} e - The event object
   */
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  /**
   * Handles month selection change for attendance filter
   * @param {Object} e - The event object
   */
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  /**
   * Determines pass/fail status based on marks
   * @param {Object} marks - Object containing marks data
   * @returns {string} - 'pass' or 'fail'
   */
  const getPassFailStatus = (marks) => {
    const aptitude = parseInt(marks.aptitude) || 0;
    const technical = parseInt(marks.technical) || 0;
    const viva = parseInt(marks.viva) || 0;
    const theory = parseInt(marks.theory) || 0;

    const totalMarks = aptitude + technical + viva + theory;
    const passThreshold = 75;
    return totalMarks >= passThreshold ? 'pass' : 'fail';
  };

  /**
   * Calculates attendance percentage
   * @returns {number} - Attendance percentage
   */
  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(record => record.attendance === 'Present').length;
    const totalDays = attendance.length;
    return (presentCount / totalDays) * 100;
  };

  /**
   * Counts tasks by status
   * @param {string} status - The task status to count
   * @returns {number} - Count of tasks with the given status
   */
  const getTaskCounts = (status) => task.filter((task) => task.task_status === status).length;



  // If payment is overdue, show payment alert

  if (dueDate && dueDate < formattedDate) {

    return (
      <div className="payment-container">
        <DueDateAlert dueDateProp={dueDate} />
        <div className="payment-card">
          <h1 className="payment-title">🚫 Account Not Accessible</h1>
          <p className="payment-message">
            Your payment is pending. Please scan the QR code below to complete your payment and regain access.
          </p>

          <div className="qr-code-box">
            <img src='https://techwingsys.com/idfc-QR-Code-TECHWINGSYS.jpg' alt="Scan to Pay" className="qr-code" />
          </div>

          <p className="payment-note">
            Once the payment is confirmed, your account will be reactivated automatically.
          </p>
        </div>
      </div>
    )
  } else {

    return (
      <div>
        <div className='main_home'>

          <section className='navbar_main'>
            <div className='inner_div_nav'>
              <div className='leftnav'>
                <img src="https://techwingsys.com/tws-logo.png" className='logo_nav' alt="" />

              </div>

              <div className='rightnav'>

                <h4 className="menus_right-earn" onClick={() => { setActiveSection('earn') }}>
                  <BsCoin className="earn-icon" />
                  <span className='earn-text-small'>₹{
                    coinsEarned
                  }
                  </span> {/**change the amount to earnings */}
                  <span className="earn-text">Earn</span>
                  <span className="earn-text-hover">Your Earinings ₹{
                    coinsEarned
                  }
                  </span>
                </h4>


                <Link to={{
                  pathname: '/ClassVideo',
                }} style={{ textDecoration: 'none' }}
                  state={{ batchname }} className="topsection_card_userhomepage_down_video" >
                  <h3><IoIosVideocam style={{ height: '25px', width: '25px' }} /></h3>
                </Link>




                <Link to={'/Project-change-pass'} className='change_password_button' >Change Password</Link>

                <h3 onClick={logout} className='menus_right'><AiOutlineLogout />  </h3>

              </div>

            </div>
          </section>




          <div className="topSectionMain_div_userHomepage">
            <div className="topsection_inner_div_userHompage">
              <div className={`topsection_card_userhomepage ${activeMenu === 'batchDetails' ? 'active' : ''}`} onClick={() => fetchData('batchDetails')}>
                <h3><FaList style={{ marginRight: '4%', height: '20px', width: '20px' }} /> <span className='menus_side_home'>Overview</span></h3>
              </div>

              <Link to={{ pathname: '/Class-video' }} style={{ textDecoration: 'none' }} state={{ batchname }} className={`topsection_card_userhomepage ${activeMenu === 'video' ? 'active' : ''}`}>
                <h3><IoIosVideocam style={{ marginRight: '4%', height: '20px', width: '20px' }} /><span className='menus_side_home'>Video</span></h3>
              </Link>
              <div className={`topsection_card_userhomepage ${activeMenu === 'attendance' ? 'active' : ''}`} onClick={() => fetchData('attendance')}>
                <h3><FaCalendarCheck style={{ marginRight: '4%', height: '20px', width: '20px' }} /><span className='menus_side_home'>Attendance</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'bill' ? 'active' : ''}`} onClick={() => fetchData('bill')}>
                <h3><IoIosCard style={{ marginRight: '4%', height: '20px', width: '20px' }} /><span className='menus_side_home'>Payment</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'announcement' ? 'active' : ''}`} onClick={() => fetchData('announcement')}>
                <h3><IoIosMailUnread style={{ marginRight: '4%', height: '20px', width: '20px' }} /><span className='menus_side_home'>Mail Box</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'Project' ? 'active' : ''}`} onClick={() => fetchData('Project')}>
                <h3><FaLaptopCode style={{ marginRight: '4%', height: '20px', width: '20px' }} /><span className='menus_side_home'>Project</span></h3>
              </div>

              <div className={`topsection_card_userhomepage ${activeMenu === 'material' ? 'active' : ''}`} onClick={() => fetchData('material')}>
                <h3><FaNoteSticky style={{ marginRight: '4%', height: '20px', width: '20px' }} /><span className='menus_side_home'>Study Material</span></h3>
              </div>

              <button style={{ fontSize: '15px' }} className={`topsection_card_userhomepage_buttons ${activeMenu === 'helpSupport' ? 'active' : ''}`} onClick={() => fetchData('helpSupport')}>
                <div><RiCustomerService2Fill style={{ marginRight: '4%', height: '20px', width: '20px' }} /><span className='menus_side_home'>Help & Support</span></div>
              </button>
              <h3 className='sidebar_bottom_text'>Kochi's Premier IT Training Institute</h3>
            </div>
          </div>




          {/**calling ad */}
          {
            addTime && <Add stopAd={setAddTime} />
          }

          {/**calling due */}
          <DueDateAlert dueDateProp={dueDate} />


          <div className='main-sec-second-third'>

            {/**calling poster ad */}
            <section className='poster-ad-section'>
              <HomePoster />

            </section>
            <section className='main-sec-second-and-third'>

              <div className='second_section_main'>
                {/* Attendance Section */}
                {activeSection === 'attendance' && (
                  <div className="attendance-container">
                    <h1 className="attendance-title">Attendance Records</h1>
                    <div className="attendance-filters">
                      <div className="filter-group">
                        <label htmlFor="year">Year</label>
                        <select id="year" onChange={handleYearChange}>
                          <option value="">Select Year</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>
                      </div>

                      <div className="filter-group">
                        <label htmlFor="month">Month</label>
                        <select id="month" onChange={handleMonthChange}>
                          <option value="">Select Month</option>
                          <option value="01">January</option>
                          <option value="02">February</option>
                          <option value="03">March</option>
                          <option value="04">April</option>
                          <option value="05">May</option>
                          <option value="06">June</option>
                          <option value="07">July</option>
                          <option value="08">August</option>
                          <option value="09">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                        </select>
                      </div>

                      <button onClick={() => fetchData('attendance')} className="filter-btn">Apply Filter</button>
                    </div>

                    {nodata ? (
                      <div className='box_notdata'>
                        <h4>No Attendance Yet Now</h4>
                      </div>
                    ) : (
                      loading ? (
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                        </div>
                      ) : (
                        <div className="attendance-content">
                          <div className="attendance-filter-buttons">
                            <button onClick={() => handleAttendanceFilter('all')} className="filter-btn">All</button>
                            <button onClick={() => handleAttendanceFilter('Present')} className="filter-btn present-btn">Present</button>
                            <button onClick={() => handleAttendanceFilter('Absent')} className="filter-btn absent-btn">Absent</button>
                          </div>

                          {filteredAttendance.length === 0 ? (
                            <p
                              className={`attendance-percentage ${calculateAttendancePercentage() < 90 ? 'danger-zone' : 'safe-zone'}`}
                            >
                              Attendance: {calculateAttendancePercentage().toFixed(2)}%
                            </p>
                          ) : (
                            <div>
                              <p
                                className={`attendance-percentage ${calculateAttendancePercentage() < 90 ? 'danger-zone' : 'safe-zone'}`}
                              >
                                Attendance: {calculateAttendancePercentage().toFixed(2)}%
                              </p>
                              <table className="attendance-table">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredAttendance
                                    .sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken)) // Sorting by date (most recent first)
                                    .map((record, index) => {
                                      const statusClass = record.attendance === 'Present' ? 'present' : 'absent';
                                      return (
                                        <tr key={index} className={statusClass}>
                                          <td>
                                            {new Date(record.date_taken).toLocaleDateString('en-GB', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric',
                                            })}
                                          </td>
                                          <td>{record.attendance}</td>
                                        </tr>
                                      );
                                    })}

                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}





                {
                  taskForm && <TaskReply />
                }

                {activeSection === 'earn' && (
                  <div>
                    <ProjectEarn />
                  </div>
                )}


                {/*  Sections tasks*/}

                {activeSection === 'task' && (
                  <div className="task-container">
                    <h1 className="task-title">Task Records</h1>

                    {/* Task Summary with Icons */}
                    <div className="task-summary">
                      <div className="summary-box total">
                        <FaTasks className="summary-icon totalicon " />
                        <p className='text_total_inner'>Total Tasks: {task.length}</p>
                      </div>

                      <div className="summary-box pending">
                        <FaHourglassHalf className="summary-icon" />
                        <p className='text_total_inner'>Pending:{getTaskCounts('Pending')}</p>
                      </div>
                      <div className="summary-box late">
                        <FaExclamationCircle className="summary-icon" />
                        <p className='text_total_inner'>Late : {getTaskCounts('Delay Completion')}</p>
                      </div>
                      <div className="summary-box completed">
                        <FaCheckCircle className="summary-icon" />
                        <p className='text_total_inner'> Completed: {getTaskCounts('Completed')}</p>
                      </div>
                    </div>

                    {/* Task Table */}
                    {nodata ? (
                      <div className="box-notdata">
                        <h4>No Task Yet Now</h4>
                      </div>
                    ) : loading ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      <div className="task-content">
                        <table className="task-table">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Date Assigned</th>
                              <th>Status</th>
                              <th>Upload</th>
                            </tr>
                          </thead>
                          <tbody>
                            {task
                              .sort((a, b) => new Date(b.date_assigned) - new Date(a.date_assigned))
                              .map((task, index) => (
                                <tr key={index} className={`task-status-${task.task_status.toLowerCase()}`}>
                                  <td>{task.task_description}</td>
                                  <td>
                                    {new Date(task.date_assigned).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </td>
                                  <td>{task.task_status}</td>
                                  <td>

                                    {task.task_status === 'Pending' ? <TaskReply task={task} /> : <button

                                      className="upload-button"
                                      style={{ color: 'green', backgroundColor: 'transparent' }}
                                    >
                                      ✔
                                    </button>}


                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}


                {/*  Sections Projects*/}

                {activeSection === 'Project' && (
                  <div className="project-docs-section">
                    <div className="section-header">
                      <h3>Project Submission</h3>
                      <p>Upload your project files and documentation</p>
                    </div>

                    <div className="docs-card">
                      <div className="card-content">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <h4>Submit Your Project</h4>
                        <p>Upload your project ZIP file and documentation</p>
                        <button
                          className="upload-docs-button"
                          onClick={() => setShowUploadModal(true)}
                        >
                          Upload Project
                        </button>
                      </div>
                    </div>

                    {showUploadModal && (
                      <DocUpload onClose={() => setShowUploadModal(false)} />
                    )}
                  </div>
                )}





                {/*  Sections reviews*/}

                {activeSection === 'reviews' && (
                  <div className="home-container">
                    <h1 className="home-title">Student Reviews</h1>
                    {loading ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      <div className="review-card-container">
                        {reviews.length === 0 ? (
                          <div className="box_notdata">
                            <p className="no-reviews box_notdata">No reviews or marks available</p>
                          </div>
                        ) : (
                          reviews.map((review, index) => {
                            const status = getPassFailStatus(review);
                            const totalMarks =
                              parseInt(review.aptitude) +
                              parseInt(review.technical) +
                              parseInt(review.viva) +
                              (parseInt(review.theory) || 0);
                            const progressPercentage = ((totalMarks / 150) * 100).toFixed(2);

                            return (
                              <div key={index} className={`review-card ${status === 'pass' ? 'pass-card' : 'fail-card'}`}>
                                <div className="review-header">
                                  <h2 className="card-title">{review.month}</h2>
                                  <p className="status-text">{status.toUpperCase()}</p>
                                </div>
                                <div className="review-body">
                                  <p><strong>Aptitude:</strong> {review.aptitude}</p>
                                  <p><strong>Technical:</strong> {review.technical}</p>
                                  <p><strong>Viva:</strong> {review.viva}</p>
                                  <p><strong>Total Marks:</strong> {totalMarks}/150</p>

                                  {/* Progress Bar */}
                                  <div className="marks-progress_main">
                                    <div className="marks-progress">
                                      <div
                                        className="marks-progress-line"
                                        style={{
                                          width: `${progressPercentage}%`,
                                          backgroundColor: status === 'pass' ? '#4caf50' : '#f44336',
                                        }}
                                      >
                                        <span className="progress-text" style={{

                                          color: status === 'pass' ? '#4caf50' : '#f44336',
                                        }}>{progressPercentage}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}




                {/*  Sections tests*/}

                {activeSection === 'tests' && (
                  <div className="home-container_tests">
                    <h1 style={{ color: '#6a5af9' }}>No Test Yet Now</h1>

                  </div>
                )}





                {/*  Sections Batch Details  and biil home*/}
                {activeSection === 'batchDetails' && (
                  <div>
                    <div className='batch-details-container'>
                      {loading ? (
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                        </div>
                      ) : (
                        batch.length === 0 ? (
                          <div className="box_notdata">
                            <p className="no-batch-data">No batch data available</p>
                          </div>
                        ) : (
                          // Batch Details Section
                          batch.map((batchItem, index) => (
                            <div className='inner_box' >
                              <div className='payment-details'>
                                {paymentData ? (

                                  <div key={paymentData.bill_id} className='payment-bill'>
                                    <div className='bill-info'>
                                      <p className='balance-amount'>
                                        {
                                          paymentData.balance_amount === '0'
                                            ? 'Payment Completed'
                                            : (
                                              <div>
                                                Balance Amount <RiMoneyRupeeCircleFill className='money-icon-home' />{paymentData.balance_amount}
                                              </div>
                                            )
                                        }
                                      </p>
                                      <div className='due-date'>{paymentData.due_date ? <div> Due Date: {new Date(paymentData.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} </div> : ' '}
                                      </div>
                                    </div>
                                    <div className="emi-progress">
                                      <div
                                        className="emi-line"
                                        style={{
                                          '--paid-percent': paymentData.balance_amount === 0
                                            ? '100%'
                                            : ((batchItem.fee - paymentData.balance_amount) / batchItem.fee * 100).toFixed(2) + '%',
                                        }}
                                      >

                                        <p

                                          className="emi-status-text"
                                          style={{
                                            '--paid-percent':
                                              paymentData && batchItem.fee
                                                ? `${((batchItem.fee - paymentData.balance_amount) / batchItem.fee * 100).toFixed(2)}% `
                                                : '0%',
                                          }}
                                        >
                                          {
                                            !paymentData.balance_amount
                                              ? (
                                                <div className="loading-spinner-pay">
                                                  <div className="spinner-pay"></div>
                                                </div>
                                              )
                                              : paymentData.balance_amount === 0
                                                ? 'Paid Off'
                                                : `${((batchItem.fee - paymentData.balance_amount) / batchItem.fee * 100).toFixed(2)}% Paid`
                                          }
                                        </p>



                                      </div>

                                    </div>

                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>

                              {/** ****************************************************** */}


                              <div key={index} className="batch-card">
                                <h1 className="batch-title">Batch Details</h1>
                                <h3>{student.name}</h3>
                                <div className="batch-header">

                                  <h3>{batchItem.pro_category}</h3>

                                </div>
                                <div className="batch-body">


                                  <p><strong><BsListTask style={{ marginRight: '8px' }} />Project Topic:</strong> {batchItem.pro_topic || "Not Available"}</p>
                                  <p><strong><FaSchool style={{ marginRight: '8px' }} />College:</strong> {student.college || "Not Available"}</p>
                                  <p><strong><FaCalendarMinus style={{ marginRight: '8px' }} />Project Category:</strong> {batchItem.pro_category || "Not Available"}</p>
                                  <p><strong><BiLoaderCircle style={{ marginRight: '8px' }} />Project Lanuage:</strong> {batchItem.pro_language}</p>
                                  <p><strong><FaRegKeyboard style={{ marginRight: '8px' }} />Project Method:</strong> {batchItem.pro_method}</p>
                                  <p><strong><IoIosCard style={{ marginRight: '8px' }} />Project Amount:</strong> {batchItem.pay_amount}/-</p>
                                </div>
                              </div>

                              {/** ********************************************************************/}


                            </div>
                          ))
                        )
                      )}
                    </div>
                  </div>

                )}

                {/* Sections study materails*/}

                {activeSection === 'material' && (
                  <div className="material-container">
                    <h1 className="material-title">Study Material</h1>
                    {loading ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      <div className="material-content">
                        {material.length === 0 ? (
                          <div className="box_notdata">
                            <p className="no-material">No materials yet now</p>
                          </div>
                        ) : (
                          <ul className="material-list">
                            {material.map((item) => {
                              const fileUrl = `https://techwingsys.com/billtws/uploads/material/${item.material_file}`;

                              return (
                                <li key={item.material_id} className="material-item">
                                  <h3>{item.material_name}</h3>
                                  <p>{item.description}</p>

                                  {item.file_path && (
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        window.open(fileUrl, '_blank', 'noopener,noreferrer');
                                      }}
                                    >
                                      View Material
                                    </a>
                                  )}
                                </li>
                              );
                            })}
                          </ul>

                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Sections study announcement*/}
                {activeSection === 'announcement' && (
                  <div className="announcement-container">
                    <h1 className="announcement-title"><IoMail className='mail-icon-head' />Mail Box</h1>

                    {loading ? (
                      <div className="loading-spinner"><div className="spinner"></div></div>
                    ) : nodata ? (
                      <div className="no-announcements-message">
                        <FaEnvelopeOpen className="empty-icon" />
                        <p>No mail available at this time</p>
                      </div>
                    ) : (
                      <div className="announcement-full">
                        <div className="announcement-grid">
                          {announcement
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .length > 0 ? (
                            announcement
                              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className={`announcement-card ${selectedItem && selectedItem.id === item.id ? 'highlighted-card' : ''}`}
                                  onClick={() => handleViewMore(item)}
                                >
                                  <FaBell className='bell-icon-mail' />
                                  <h4
                                    className="announcement-card-title"
                                    dangerouslySetInnerHTML={{ __html: cleanHtml(item.title) }}
                                  ></h4>
                                  <p className='announcement-p-des'>
                                    {getShortHtmlLength(item.description, 10)}
                                    <span
                                      className='announcement-p-span'
                                      onClick={() => handleViewMore(item)}
                                    >
                                      See more
                                    </span>
                                  </p>
                                </div>
                              ))
                          ) : (
                            <div className="no-announcements-message">
                              <FaEnvelopeOpen className="empty-icon" />
                              <p>No mail available at this time</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedItem && <ViewAnnou content={selectedItem} onClose={closeViewMore} />}
                  </div>
                )}



                {/* Sections Bill*/}

                {activeSection === 'bill' && (
                  <div className="bill-container">
                    <h1>Bill Details</h1>
                    {loading ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      bill.length === 0 ? (
                        <div className="box_notdata">
                          <p >No bill data available</p>
                        </div>
                      ) : (
                        bill.map((record, index) => (
                          <div key={index} className="bill-card">
                            <div className="bill-header">
                              <h3>Bill ID: {record.bill_id}</h3>
                              <p><strong>Pay Status:</strong> {record.pay_status}</p>
                            </div>
                            <div className="bill-body">
                              <p><strong>Amount:</strong> ₹{record.amount}</p>
                              <p><strong>Balance Amount:</strong> ₹{record.balance_amount}</p>
                              <p><strong>Payment Method:</strong> {record.pay_method}</p>
                              <p><strong>Pay Date:</strong> {new Date(record.pay_date).toLocaleDateString()}</p>
                              <p><strong>Due Date:</strong> {new Date(record.due_date).toLocaleDateString()}</p>
                              <p><strong>Number of EMIs:</strong> {record.no_of_emi}</p>
                              <p><strong>Training ID:</strong> {record.training_id}</p>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Sections Announcement*/}

              <div className="third_section_main">



                <div className="mailbox-container">
                  <div className="mailbox-header">
                    <span className="mailbox-icon">📧</span>
                    <h2>Recent Mail Box Updates</h2>
                  </div>
                  {homeAnnouncement.length > 0 ? (
                    homeAnnouncement
                      .filter(item => item && item.title) // filter out empty or invalid items
                      .map((item, index) => (
                        <div className="mailbox-card" key={index} onClick={() => handleViewMore(item)}>
                          <h4 className="mailbox-title">
                            <LuBellDot className='bell-icon-mail-home' />
                            {cleanHtml(item.title)}
                          </h4>
                          <p className="mailbox-body">
                            {getShortHtmlLength(item.description, 10)}
                            <span
                              className="span-home-mail"
                              onClick={() => handleViewMore(item)}
                            >
                              Open
                            </span>
                          </p>
                        </div>
                      ))
                  ) : (
                    <div className="no-mail-message">
                      <div className="no-announcements-message">
                        <FaEnvelopeOpen className="empty-icon" />
                        <p>No mail available at this time</p>
                      </div>
                    </div>
                  )}

                </div>
                {selectedItem && <ViewAnnou content={selectedItem} onClose={closeViewMore} />}
              </div>


            </section>
          </div >

        </div >


        {/* Sections Sidebar Down side*/}
        <div div className="topSectionMain_div_userHomepage_down" >
          <div className="topsection_inner_div_userHompage_down">
            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('batchDetails')}
            >
              <span className="res_down_menus">Overview</span>
              <h3>
                <FaList
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('attendance')}
            >
              <span className="res_down_menus">Attendance</span>
              <h3>
                <FaCalendarCheck
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('bill')}
            >
              <span className="res_down_menus">Payment</span>
              <h3>
                <IoIosCard
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>


            <div className="topsection_card_userhomepage_down" onClick={() => fetchData('announcement')}>
              <span className='res_down_menus'>Mail Box</span>
              <h3><IoIosMailUnread style={{ marginRight: '4%', height: '25px', width: '25px' }} /></h3>
            </div>



            {/* —— NEW “More” CARD —— */}
            <div
              className="topsection_card_userhomepage_down"
              onClick={toggleMore}
              style={{ position: 'relative' }}
            >{!showMore &&
              <span className="res_down_menus">More</span>
              }
              <h3>
                <FaFolderOpen
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>

              {showMore && (
                <div
                  className="more-dropdown"
                  style={{
                    position: 'absolute',
                    bottom: '100%',     // “drop-top” sits above the card
                    left: '-30px',
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    boxShadow: '2px 0px 6px rgba(0, 0, 0, 0.45)',
                    zIndex: 10,
                    width: '50px',
                    textAlign: 'left',
                  }}
                >
                  <div
                    className="topsection_card_userhomepage_down-more"
                    onClick={() => fetchData('material')}
                  >
                    <span className="res_down_menus-more">Study Material</span>
                    <h3>
                      <FaNoteSticky
                        style={{ height: '25px', width: '25px' }}
                      />
                    </h3>
                  </div>



                </div>
              )}
            </div>
            {/* —— END “More” CARD —— */}
          </div>
        </div >


        <Footer />
      </div >
    )
  }
}

export default ProjectHome;

