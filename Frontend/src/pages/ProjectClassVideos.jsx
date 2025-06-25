import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import "./ClassVideo.css";
import { AiFillHome } from "react-icons/ai";
import { PlayCircle, PauseCircle, Volume2, Maximize, Minimize } from "lucide-react";
import { useSelector } from 'react-redux';
import Footer from "./Footer";
import { basicRequest, TokenRequest } from "../AxiosCreate";
import Add from "../components/Add";

function ProjectClassVideo() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [noVideos, setNoVideos] = useState(false);

  var [addTime, setAddTime] = useState(false)

  let inactivityTimeout = useRef(null);
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  var id = logininfom.trainingIdArrayProject[0]

  useEffect(() => {
    if (logininfom) {
      async function fetchVideos() {
        try {
          const response1 = await basicRequest.get(`/project/getGroupDetails?project_id=${id}`);
          const groupData = response1.data[0]; // assuming it's an array

          if (!groupData) {
            console.error("No group data found for this project");
            setNoVideos(true);
            return;
          }

          let response;
          if (groupData.pro_type === 'Single Project') {
            response = await TokenRequest.get(`/project/getdatavideos?id=${groupData.project_id}`);
          } else {
            response = await TokenRequest.get(`/project/getdatavideos?group=${groupData.pro_type}`);
          }

          if (response.data && response.data.length > 0) {
            setVideos(response.data);
            setSelectedVideo(response.data[response.data.length - 1]);
            setNoVideos(false);
          } else {
            setVideos([]);
            setSelectedVideo(null);
            setNoVideos(true);
          }

        } catch (error) {
          console.error("Error fetching videos:", error);
          setNoVideos(true);
        }
      }

      fetchVideos();
      showAd();
    }
  }, [logininfom]);


  const filteredVideos = searchQuery
    ? videos.filter((video) => video.video_title.toLowerCase().includes(searchQuery.toLowerCase()))
    : videos;

  const handleScrubChange = (e) => {
    const seekTime = parseFloat(e.target.value);
    setPlayed(seekTime);
    if (playerRef.current) {
      playerRef.current.seekTo(seekTime);
    }
  };

  const handleProgress = (progress) => {
    setPlayed(progress.playedSeconds);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleDuration = (dur) => {
    setDuration(dur);
  };

  const toggleFullscreen = () => {
    if (wrapperRef.current) {
      if (!isFullscreen) {
        if (wrapperRef.current.requestFullscreen) {
          wrapperRef.current.requestFullscreen();
        } else if (wrapperRef.current.webkitRequestFullscreen) {
          wrapperRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };



  const resetInactivityTimeout = () => {
    setShowControls(true);
    clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = setTimeout(() => setShowControls(false), 5000);
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      resetInactivityTimeout();
    };

    document.addEventListener("mousemove", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      clearTimeout(inactivityTimeout.current);
      document.removeEventListener("mousemove", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);



  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVideoSelection = (video, index) => {
    setSelectedVideo(video);
    setActiveVideoIndex(index);
  };

  function showAd() {
    setTimeout(() => {
      setAddTime(true)
    }, 10000);
  }

  return (
    <div>


      <div>
        {
          addTime && <Add stopAd={setAddTime} />
        }
        <section className="navbar_main_video">
          <div className="inner_div_nav_video">
            <div className="leftnav_video">
              <img src="https://techwingsys.com/tws-logo.png" className="logo_nav_video" alt="" />
            </div>
            <div className="rightnav_video">
              <Link style={{ textDecoration: "none" }} to={"/"}>
                <button className="menus_right_video">
                  <AiFillHome /> <span className="menus_right_video_text">Home page</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {noVideos ? (
          <h1 style={{ height: '700px' ,paddingTop:'100px' }}>No Videos Available</h1>
        ) : (

          <section className="video_displaysec">

            <div className="d-flex flex-column flex-md-row">
              <div className="main-content" ref={wrapperRef} onMouseMove={resetInactivityTimeout}>
                <h2 style={{ display: isFullscreen ? "none" : "block" }}>
                  {selectedVideo ? selectedVideo.video_title : "Select a Video"}
                </h2>


                <div className="video-container p-3" style={{ width: isFullscreen ? "100%" : "100%", height: isFullscreen ? "100%" : "100%" }}>
                  {selectedVideo ? (
                    <div className="video-wrapper" >
                      <ReactPlayer
                        ref={playerRef}
                        url={selectedVideo.video_link}
                        width={isFullscreen ? "100%" : "100%"}
                        height={isFullscreen ? "calc(105vh - 120px)" : "500px"}
                        playing={isPlaying}
                        volume={volume}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        pip={false}
                        controls={false}
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
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        controlsList="nodownload"
                        className='video_screen'
                      />
                      <div className="video-shield" style={{ height: isFullscreen ? "calc(105vh - 120px)" : "500px" }} />


                      {showControls && (
                        <div>
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
                                onChange={handleVolumeChange}
                                className="volume-slider"
                              />
                            </div>

                            {/* Timeline Scrubber with Time Display */}
                            <div className="timeline-wrapper">
                              <span style={{ color: 'white' }}>{formatTime(played)}</span>
                              <input
                                type="range"
                                min={0}
                                max={duration}
                                step="0.1"
                                value={played}
                                onChange={handleScrubChange}
                                className="timeline-slider"
                              />
                              <span style={{ color: 'white' }}>{formatTime(duration)}</span>
                            </div>

                            {/* Fullscreen Toggle */}
                            <button onClick={toggleFullscreen} className="control-btn">
                              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                            </button>
                          </div>

                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sidebar p-10">
                <h4 className="mb-3 text-white">Course Content</h4>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control mb-3"
                  placeholder="Search by video title or date"
                />
                <ul className="list-group">
                  {filteredVideos.length > 0 ? (
                    [...filteredVideos].reverse().map((video, index) => (
                      <li key={index} className="list-group-item">
                        <a
                          href="#"
                          className={`text-decoration-none ${activeVideoIndex === index ? 'active-video' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleVideoSelection(video, index);
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
        )}
      </div>


      <Footer className="footer_video" />
    </div>
  );
}

export default ProjectClassVideo;