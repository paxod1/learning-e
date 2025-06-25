import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { basicRequest } from '../AxiosCreate';
import { LoginData, LogoutData } from '../Redux/UserSlice';

function MultiProject({ data }) {
    console.log(data);
    
    const [project, setProject] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function getCourses() {
            try {
                const responses = await Promise.all(
                    data.trainingIdArrayProject.map(id =>
                        basicRequest.get(`/project/getGroupDetails?project_id=${id}`)
                    )
                );

                // Flatten all [Array(1)] responses into one flat array
                const ProjectData = responses.flatMap(res => res.data);
                setProject(ProjectData);
                console.log(ProjectData);

            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        }

        getCourses();
    }, [data]);

const handleSelect = (selectedProject) => {
    const updatedData = {
        ...data,
        trainingIdArrayProject: [selectedProject.project_id]
    };

    dispatch(LogoutData());
    dispatch(LoginData(updatedData));
    navigate('/'); // or your target route
};


    return (
        <div className="multi-course-container">
            <h2>Select Your Project</h2>
            <div className="course-box-wrapper">
                <div className="course-box-wrapper">
                    {project && project.map((project, index) => (
                        <div
                            key={index}
                            className="course-box"
                            onClick={() => handleSelect(project)}
                        >
                            <h3>{project.pro_category || `Course ${index + 1}`}</h3>
                            <p>Language: {project.pro_language}</p>
                            <p>Topic: {project.pro_topic}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}


export default MultiProject