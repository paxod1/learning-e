import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomePoster.css';
import { useEffect } from 'react';
import { basicRequest } from '../AxiosCreate';

function HomePoster() {
  const [posterData, setPosterData] = useState([]);

  useEffect(() => {
    async function GetBanner() {
      var response = await basicRequest.get('/student/getbanner');
      console.log(response.data);
      setPosterData(response.data)
    }
    GetBanner()

  }, [])



  const settings = {
    dots: false,              // Hide the navigation dots
    arrows: false,            // Hide the arrow buttons
    infinite: true,           // Infinite looping
    speed: 500,               // Transition speed
    slidesToShow: 1,          // Show one slide at a time
    slidesToScroll: 1,        // Scroll one slide at a time
    autoplay: true,           // Enable auto-play
    autoplaySpeed: 3000,      // Auto-play speed
    draggable: true,          // Enable dragging/swiping
    swipe: true,              // Enable swipe
    swipeToSlide: true,       // Allow swiping to slide
    pauseOnHover: false       // Don't pause on hover
  };

  return (
    <div className="home-poster-container">
      <Slider {...settings}>
        {posterData.map((item, index) => (
          <div key={index}>
            <img
              className="poster-img"
              src={`https://techwingsys.com/billtws/uploads/banner/${item.image}`}
              alt={`Slide ${index + 1}`}

            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomePoster;