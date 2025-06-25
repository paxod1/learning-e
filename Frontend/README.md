# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
































import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TokenRequest } from "../AxiosCreate";
import ReactPlayer from "react-player";
import './ClassVideo.css'; // Ensure this CSS file is imported
import { AiFillHome } from "react-icons/ai";
import Footer from "./Footer";

function ClassVideo() {
    const location = useLocation();
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const initialBatchname = location.state?.batchname || localStorage.getItem("batchname");
    const [batchname, setBatchname] = useState(initialBatchname);

    useEffect(() => {
        if (batchname) {
            localStorage.setItem("batchname", batchname);

            async function fetchVideos() {
                try {
                    const response = await TokenRequest.get(`/student/getdatavideos?batchname=${batchname}`);
                    setVideos(response.data);
                    setSelectedVideo(response.data.length > 0 ? response.data[response.data.length - 1] : null);
                } catch (error) {
                    console.error("Error fetching videos:", error);
                }
            }
            fetchVideos();
        }
    }, [batchname]);

    const filteredVideos = searchQuery
        ? videos.filter((video) => {
            return video.video_title.toLowerCase().includes(searchQuery.toLowerCase());
        })
        : videos;

    return (
        <div>
            <section className="navbar_main_video">
                <div className="inner_div_nav_video">
                    <div className="leftnav_video">
                        <img src="../../public/logo (1).png" className="logo_nav_video" alt="" />
                    </div>
                    <div className="rightnav_video">
                        <Link style={{ textDecoration: "none" }} to={"/"}>
                            <button className="menus_right_video">
                                <AiFillHome /> Home page
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="video_displaysec">
                <div className="d-flex flex-column flex-md-row">
                    <div className="main-content">
                        <h2>{selectedVideo ? selectedVideo.video_title : "Select a Video"}</h2>
                        <div className="video-container p-3">
                            {selectedVideo ? (
                                <ReactPlayer
                                    url={selectedVideo.video_link}
                                    width="100%"
                                    height="400px"
                                    controls={true}
                                    pip={false}
                                    playing={false}
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                modestbranding: 1,
                                                controls: 0,
                                                showinfo: 0,
                                                rel: 0,
                                                iv_load_policy: 3,
                                                fs: 0,
                                                disablekb: 1,
                                            },
                                        },
                                        vimeo: {
                                            playerOptions: {
                                                autopause: 0,
                                                autoplay: 0,
                                                loop: 0,
                                                title: 0,
                                                byline: 0,
                                                portrait: 0,
                                            },
                                        },
                                    }}
                                    onContextMenu={(e) => e.preventDefault()}
                                    controlsList="nodownload"
                                />
                            ) : (
                                <p>Loading videos...</p>
                            )}
                        </div>
                    </div>

                    <div className="sidebar p-10">
                        <h4 className="mb-3">Course Content</h4>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control mb-3"
                            placeholder="Search by video title or date"
                        />
                        <ul className="list-group">
                            {filteredVideos.length > 0 ? (
                                filteredVideos.map((video, index) => (
                                    <li key={index} className="list-group-item">
                                        <a
                                            href="#"
                                            className="text-decoration-none"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedVideo(video);
                                            }}
                                        >
                                            {video.video_title}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <p>No videos found with the selected title.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default ClassVideo;





































import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { TokenRequest } from "../AxiosCreate";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";
import "./ClassVideo.css";
import { AiFillHome } from "react-icons/ai";
import Footer from "./Footer";

function ClassVideo() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const initialBatchname = location.state?.batchname || localStorage.getItem("batchname");
  const [batchname, setBatchname] = useState(initialBatchname);
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    if (batchname) {
      localStorage.setItem("batchname", batchname);

      async function fetchVideos() {
        try {
          const response = await TokenRequest.get(`/student/getdatavideos?batchname=${batchname}`);
          setVideos(response.data);
          setSelectedVideo(response.data.length > 0 ? response.data[response.data.length - 1] : null);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      }
      fetchVideos();
    }
  }, [batchname]);

  useEffect(() => {
    if (selectedVideo && videoPlayerRef.current) {
      const youtubeVideoId = selectedVideo.video_link.split("/").pop();
      console.log("Selected Video ID:", youtubeVideoId);
  
      const videoElement = videoPlayerRef.current;
      if (videoElement) {
        // Initialize video.js player after ensuring the element is in the DOM
        setTimeout(() => {
          // Dispose of any existing player before reinitializing
          const player = videojs(videoElement, {
            controls: true,
            autoplay: false,
            fluid: true,
            sources: [
              {
                src: `https://www.youtube.com/embed/${youtubeVideoId}`,
                type: "video/youtube",
              },
            ],
            youtube: {
              modestbranding: 1,
              rel: 0,
              controls: 1,
              showinfo: 0,
              iv_load_policy: 3,
              fs: 0,
              disablekb: 1,
            },
          });
  
          // Dispose of the player when the component unmounts or video changes
          return () => {
            if (player) {
              player.dispose();
            }
          };
        }, 500);
      }
    }
  }, [selectedVideo]);
  

  const filteredVideos = searchQuery
    ? videos.filter((video) => {
      return video.video_title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    : videos;

  return (
    <div>
      <section className="navbar_main_video">
        <div className="inner_div_nav_video">
          <div className="leftnav_video">
            <img src="../../public/logo (1).png" className="logo_nav_video" alt="" />
          </div>
          <div className="rightnav_video">
            <Link style={{ textDecoration: "none" }} to={"/"}>
              <button className="menus_right_video">
                <AiFillHome /> Home page
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="video_displaysec">
        <div className="d-flex flex-column flex-md-row">
          <div className="main-content">
            <h2>{selectedVideo ? selectedVideo.video_title : "Select a Video"}</h2>



            <div className="video-container p-3" style={{ position: "relative" }}>
              {selectedVideo ? (
                <div data-vjs-player>
                  <div className="video-shield"></div> 
                  <video
                    ref={videoPlayerRef}
                    className="video-js vjs-big-play-centered"
                    onContextMenu={(e) => e.preventDefault()} // Disable right-click on the video
                    controlsList="nodownload" // Disable download option
                    style={{ position: "relative", zIndex: 2 }}  // Video should be under the shield but above everything else
                  ></video>
                </div>
              ) : (
                <p>Select a video to play</p>
              )}
            </div>





          </div>

          <div className="sidebar p-10">
            <h4 className="mb-3">Course Content</h4>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control mb-3"
              placeholder="Search by video title or date"
            />
            <ul className="list-group">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video, index) => (
                  <li key={index} className="list-group-item">
                    <div
                      className="text-decoration-none cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default behavior
                        setSelectedVideo(video); // Update selected video without navigating
                      }}
                    >
                      {video.video_title}
                    </div>
                  </li>
                ))
              ) : (
                <p>No videos found with the selected title.</p>
              )}
            </ul>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}

export default ClassVideo;
































import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { TokenRequest } from "../AxiosCreate";
import "video.js/dist/video-js.css";
import "videojs-youtube";
import "./ClassVideo.css";
import { AiFillHome } from "react-icons/ai";
import Footer from "./Footer";
import videojs from "video.js"; 

function ClassVideo() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const initialBatchname = location.state?.batchname || localStorage.getItem("batchname");
  const [batchname, setBatchname] = useState(initialBatchname);
  const videoPlayerRef = useRef(null);
  const playerRef = useRef(null); // Ref to store the player instance

  useEffect(() => {
    if (batchname) {
      localStorage.setItem("batchname", batchname);

      async function fetchVideos() {
        try {
          const response = await TokenRequest.get(`/student/getdatavideos?batchname=${batchname}`);
          setVideos(response.data);
          setSelectedVideo(response.data.length > 0 ? response.data[response.data.length - 1] : null);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      }
      fetchVideos();
    }
  }, [batchname]);

  const initializePlayer = (videoUrl) => {
    const videoElement = videoPlayerRef.current;

    if (videoElement) {
      // Dispose of the existing player instance if it exists
      if (playerRef.current) {
        playerRef.current.dispose();
      }

      // Initialize the new player instance
      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: true,
        fluid: true,
        sources: [
          {
            src: videoUrl,
            type: "video/youtube",
          },
        ],
        youtube: {
          modestbranding: 1,
          rel: 0,
          controls: 0, // Disable YouTube controls
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
        },
      });

      // Start the video after initialization
      playerRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  useEffect(() => {
    if (selectedVideo && selectedVideo.video_link) {
      let youtubeUrl = selectedVideo.video_link;

      // Convert `youtu.be` URLs to `watch?v=` format
      if (youtubeUrl.includes("youtu.be")) {
        const videoId = youtubeUrl.split("/").pop();
        youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }

      console.log("Formatted YouTube URL:", youtubeUrl);

      initializePlayer(youtubeUrl);

    }
  }, [selectedVideo]); // Re-run this effect when `selectedVideo` changes

  const filteredVideos = searchQuery
    ? videos.filter((video) => {
        return video.video_title.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : videos;

  return (
    <div>
      <section className="navbar_main_video">
        <div className="inner_div_nav_video">
          <div className="leftnav_video">
            <img src="../../public/logo (1).png" className="logo_nav_video" alt="" />
          </div>
          <div className="rightnav_video">
            <Link style={{ textDecoration: "none" }} to={"/"}>
              <button className="menus_right_video">
                <AiFillHome /> Home page
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="video_displaysec">
        <div className="d-flex flex-column flex-md-row">
          <div className="main-content">
            <h2>{selectedVideo ? selectedVideo.video_title : "Select a Video"}</h2>

            <div className="video-container p-3" style={{ position: "relative" }}>
              {selectedVideo ? (
                <div data-vjs-player>
                  <div className="video-shield"></div>
                  <video
                    ref={videoPlayerRef}
                    className="video-js vjs-big-play-centered"
                    onContextMenu={(e) => e.preventDefault()} // Disable right-click on the video
                    controlsList="nodownload" // Disable download option
                    style={{ position: "relative", zIndex: 2 }} // Video should be under the shield but above everything else
                  ></video>
                </div>
              ) : (
                <p>Select a video to play</p>
              )}
            </div>
          </div>

          <div className="sidebar p-10">
            <h4 className="mb-3">Course Content</h4>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control mb-3"
              placeholder="Search by video title or date"
            />
            <ul className="list-group">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video, index) => (
                  <li key={index} className="list-group-item">
                    <div
                      className="text-decoration-none cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedVideo(video);  // Set selected video
                      }}
                    >
                      {video.video_title}
                    </div>
                  </li>
                ))
              ) : (
                <p>No videos found with the selected title.</p>
              )}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ClassVideo;













<!-- review  -->



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
                <p className="no-reviews">No reviews or marks available</p>
              ) : (
                reviews.map((review, index) => {
                  const status = getPassFailStatus(review);
                  const totalMarks =
                    parseInt(review.aptitude) +
                    parseInt(review.technical) +
                    parseInt(review.viva) +
                    (parseInt(review.theory) || 0);
                  return (
                    <div key={index} className={`review-card ${status === 'pass' ? 'pass-card' : 'fail-card'}`}>
                      <div className="review-header">
                        <h2 className="card-title">{review.month}</h2>
                        <p className="status-text">{status.toUpperCase()}</p>
                      </div>
                      <div className="review-body">
                        <p><strong>Review By:</strong> {review.auth_user}</p>
                        <p><strong>Aptitude:</strong> {review.aptitude}</p>
                        <p><strong>Technical:</strong> {review.technical}</p>
                        <p><strong>Viva:</strong> {review.viva}</p>
                        <p><strong>Theory:</strong> {review.theory || 'N/A'}</p>
                        <p><strong>Total Marks:</strong> {totalMarks}/150</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}























          {/* Custom Controls */}
                  <div className="custom-controls">
                    {/* Play/Pause Button */}
                    <button onClick={() => setIsPlaying(!isPlaying)} className="control-btn">
                      {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
                    </button>

                    {/* Volume Control */}
                    <div className="volume-control">
                      <Volume2 size={20} />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="volume-slider"
                      />
                    </div>

                    {/* Timeline Scrubber */}
                    <div className="timeline">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step="0.01"
                        value={played}
                        onChange={handleScrubChange}
                        className="timeline-slider"
                      />
                    </div>
                  </div>












                   const handleScrubChange = (e) => {
    const seekTime = parseFloat(e.target.value);
    setPlayed(seekTime);

    if (playerRef.current) {
      playerRef.current.seekTo(seekTime);
    }
  };