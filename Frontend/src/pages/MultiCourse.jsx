import React, { useEffect, useState } from 'react';
import './MultiCourse.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { basicRequest, TokenRequest } from '../AxiosCreate';
import { LoginData, LogoutData } from '../Redux/UserSlice';


function MultiCourse({ data }) {
    const [courses, setCourses] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function getCourses() {
            try {
                const responses = await Promise.all(
                    data.trainingIdArray.map(id =>
                        basicRequest.get(`/student/getdatatraining?training_id=${id}`)
                    )
                );



                // Flatten all [Array(1)] responses into one flat array
                const courseData = responses.flatMap(res => res.data);
                setCourses(courseData);

            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        }

        getCourses();
    }, [data]);

    const handleSelect = (selectedCourse) => {
        dispatch(LogoutData())
        dispatch(LoginData({ ...data, selectedTrainingId: selectedCourse.training_id }));
        navigate('/'); // or your target route
    };

    return (
        <div className="multi-course-container">
            <h2>Select Your Course</h2>
            <div className="course-box-wrapper">
                <div className="course-box-wrapper">
                    {courses && courses.map((course, index) => (
                        <div
                            key={index}
                            className="course-box"
                            onClick={() => handleSelect(course)}
                        >
                            <h3>{course.course_name || `Course ${index + 1}`}</h3>
                            <p>Batch: {course.batch}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default MultiCourse;
