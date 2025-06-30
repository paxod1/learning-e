import React, { useState } from 'react';
import './DocUpload.css';
import { useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import Swal from 'sweetalert2';

function DocUpload({ onClose }) {
    const [projectFile, setProjectFile] = useState(null);
    const [documentationFile, setDocumentationFile] = useState(null);
    const [isDraggingProject, setIsDraggingProject] = useState(false);
    const [isDraggingDoc, setIsDraggingDoc] = useState(false);
    var [loading, setLoading] = useState(false)
    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

    var project_id = logininfom.trainingIdArrayProject[0]
    var pro_stud_id = logininfom.pro_stud_id

    const handleProjectFileChange = (e) => {
        setProjectFile(e.target.files[0]);
    };

    const handleDocFileChange = (e) => {
        setDocumentationFile(e.target.files[0]);
    };

    const handleDragOver = (e, type) => {
        e.preventDefault();
        type === 'project' ? setIsDraggingProject(true) : setIsDraggingDoc(true);
    };

    const handleDragLeave = (type) => {
        type === 'project' ? setIsDraggingProject(false) : setIsDraggingDoc(false);
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        if (type === 'project') {
            setIsDraggingProject(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setProjectFile(e.dataTransfer.files[0]);
            }
        } else {
            setIsDraggingDoc(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setDocumentationFile(e.dataTransfer.files[0]);
            }
        }
    };

    const handleUpload = async () => {
        setLoading(true)
        if (!projectFile || !documentationFile) {
            alert('Please select both files before uploading!');
            return;
        }

        const formData = new FormData();
        formData.append('projectFile', projectFile);
        formData.append('documentationFile', documentationFile);
        formData.append('project_id', project_id);
        formData.append('pro_stud_id',pro_stud_id)

        try {
            const response = await TokenRequest.post('/project/submit-project', formData);

            Swal.fire({
                icon: 'success',
                title: 'Project Uploaded Successfully',
                html: `
            <p>Your project has been uploaded.</p>`,
                confirmButtonText: 'OK'
            });

            onClose();

        } catch (error) {
            console.error('Submission failed:', error);
            alert(error.response?.data?.message || 'Failed to submit project');

        }

    };

    return (
        <div className="modal-background">
            <div className="modal-content-project">
                <div className="modal-header">
                    <h2>Project Submission</h2>
                    <p>Upload your project files and documentation</p>
                </div>

                <div className="upload-sections">
                    {/* Project File Upload */}
                    <div className="upload-section">
                        <h3>Project File (ZIP)</h3>
                        <div
                            className={`upload-area ${isDraggingProject ? 'dragging' : ''}`}
                            onDragOver={(e) => handleDragOver(e, 'project')}
                            onDragLeave={() => handleDragLeave('project')}
                            onDrop={(e) => handleDrop(e, 'project')}
                        >
                            <div className="upload-icon">
                                <svg width="38" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                            </div>
                            <p>Drag & drop your project ZIP file here or</p>
                            <label className="browse-button">
                                Browse Files
                                <input
                                    type="file"
                                    onChange={handleProjectFileChange}
                                    accept=".zip,.rar,.7zip"
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {projectFile && (
                                <div className="file-preview">
                                    <span className="file-name">{projectFile.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documentation File Upload */}
                    <div className="upload-section">
                        <h3>Project Documentation</h3>
                        <div
                            className={`upload-area ${isDraggingDoc ? 'dragging' : ''}`}
                            onDragOver={(e) => handleDragOver(e, 'doc')}
                            onDragLeave={() => handleDragLeave('doc')}
                            onDrop={(e) => handleDrop(e, 'doc')}
                        >
                            <div className="upload-icon">
                                <svg width="38" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                            </div>
                            <p>Drag & drop your documentation file here or</p>
                            <label className="browse-button">
                                Browse Files
                                <input
                                    type="file"
                                    onChange={handleDocFileChange}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {documentationFile && (
                                <div className="file-preview">
                                    <span className="file-name">{documentationFile.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>

                    {
                        loading ? <button
                            className="upload-button"
                            disabled
                        >Submiting..  </button> : <button
                            className="upload-button"
                            onClick={handleUpload}
                            disabled={!projectFile || !documentationFile}
                        >Submit  </button>

                    }


                </div>
            </div>
        </div>
    );
}

export default DocUpload;