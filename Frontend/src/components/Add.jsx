import React, { useState, useEffect } from 'react';
import './Add.css';
import { basicRequest } from '../AxiosCreate';

function Add({ stopAd }) {
    const [adFile, setAdFile] = useState('');
    const [fileType, setFileType] = useState('');
    var [time, setTime] = useState(false)

    useEffect(() => {
        async function getAd() {
            try {
                const response = await basicRequest.get('/student/getad');
                const data = response.data;
                console.log("from ad >>>>>>>>", data);

                const updateImage = () => {
                    const isMobile = window.innerWidth <= 750;
                    const matchedAd = data.find(item =>
                        isMobile ? item.view_type === 'Mobile' : item.view_type === 'Desktop'
                    );

                    if (matchedAd && matchedAd.file) {
                        const file = matchedAd.file;
                        const fileExt = file.split('.').pop().toLowerCase();
                        setAdFile(`https://techwingsys.com/billtws/uploads/popup/${file}`);
                        setFileType(fileExt);
                    } else {
                        setAdFile('');
                        setFileType('');
                    }
                };

                updateImage(); // Initial check
                window.addEventListener('resize', updateImage);
                setTimeout(() => {
                    setTime(true)
                }, 5000);

                return () => window.removeEventListener('resize', updateImage);



            } catch (error) {
                console.log("Error from ad getting", error);
            }
        }

        getAd();
    }, []);

    function clearAddPage() {
        stopAd(false);
    }

    const isVideo = ['mp4', 'webm'].includes(fileType);
    const isGif = fileType === 'gif';

    return (
        <div>
            {
                time && (
                    <div className="ad-container">
                        <div className="ad-card">
                            {
                                adFile && (
                                    isVideo ? (
                                        <video className="ad-image" controls autoPlay muted loop>
                                            <source src={adFile} type={`video/${fileType}`} />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img
                                            src={adFile}
                                            alt="Ad"
                                            className="ad-image"
                                        />
                                    )
                                )
                            }

                            <button className="close-btn" onClick={clearAddPage}>✖</button>
                        </div>
                    </div>
                )

            }
        </div>
    );
}

export default Add;
