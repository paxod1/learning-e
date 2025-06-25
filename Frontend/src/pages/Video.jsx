import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "./Video.css";
import "videojs-youtube"; // YouTube tech for Video.js

const CustomVideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Ensure proper cleanup of previous player instance
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // Format the YouTube URL if it's a shortened `youtu.be` link
    const formattedUrl = videoUrl && videoUrl.includes("youtu.be")
      ? videoUrl.replace("youtu.be/", "www.youtube.com/watch?v=")
      : videoUrl;

    if (videoRef.current && formattedUrl) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        fluid: true,
        techOrder: ["youtube"],
        sources: [
          {
            src: formattedUrl,
            type: "video/youtube",
          },
        ],
        youtube: {
          modestbranding: 1,
          rel: 0,
          controls: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
        },
      });
    }

    return () => {
      // Dispose the player instance to clean up memory properly
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered"></video>
    </div>
  );
};

export default CustomVideoPlayer;
