import React, { useState } from 'react';
import './DocUpload.css';
import { useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import Swal from 'sweetalert2';

function ProjectUpload({ onClose }) {
    const [projectFile, setProjectFile] = useState(null);
    const [isDraggingProject, setIsDraggingProject] = useState(false);
    const [loading, setLoading] = useState(false);

  

    const handleProjectFileChange = (e) => {
        setProjectFile(e.target.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingProject(true);
    };

    const handleDragLeave = () => {
        setIsDraggingProject(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingProject(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setProjectFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        setLoading(true);
        if (!projectFile) {
            alert('Please select a project file before uploading!');
            return;
        }

        const formData = new FormData();
        formData.append('projectFile', projectFile);
     

        try {
            const response = await TokenRequest.post('/student/submit-project', formData);

            Swal.fire({
                icon: 'success',
                title: 'Project Uploaded Successfully',
                text: 'Your project file has been uploaded.',
                confirmButtonText: 'OK'
            });

            onClose();

        } catch (error) {
            console.error('Upload failed:', error);
            alert(error.response?.data?.message || 'Failed to upload project file.');
        }
    };

    return (
        <div className="modal-background">
            <div className="modal-content-project">
                <div className="modal-header">
                    <h2>Project Submission</h2>
                    <p>Upload your project ZIP file</p>
                </div>

                <div className="upload-section">
                    <h3>Project File (ZIP)</h3>
                    <div
                        className={`upload-area ${isDraggingProject ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
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

                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button
                        className="upload-button"
                        onClick={handleUpload}
                        disabled={!projectFile || loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProjectUpload;
