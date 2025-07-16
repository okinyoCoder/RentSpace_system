import { useState, useEffect, useRef } from 'react';
import './slider.scss';

const BASE_URL = 'https://your-api.com'; // 🔁 Replace with your backend base URL if using relative paths

function Slider({ images }) {
  const imageUrls = Array.isArray(images)
    ? images
      .map((url) => {
        if (typeof url !== 'string') return null;
        return url.startsWith('http') ? url : `${BASE_URL}${url}`;
      })
      .filter((url) => !!url && url.trim() !== '')
    : [];

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullSliderOpen, setIsFullSliderOpen] = useState(false);
  const intervalRef = useRef(null);

  const changeSlide = (direction) => {
    setMainImageIndex((prev) =>
      direction === 'left'
        ? (prev === 0 ? imageUrls.length - 1 : prev - 1)
        : (prev === imageUrls.length - 1 ? 0 : prev + 1)
    );
  };

  // 🔁 Autoplay logic (every 5 seconds)
  useEffect(() => {
    if (imageUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setMainImageIndex((prev) =>
          prev === imageUrls.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(intervalRef.current);
    }
  }, [imageUrls]);

  if (imageUrls.length === 0) {
    return <div className="slider">No images available</div>;
  }

  return (
    <div className="slider">
      {isFullSliderOpen && (
        <div className="fullSlider">
          <div className="arrow" onClick={() => changeSlide('left')}>
            <img src="/arrow.png" alt="Left Arrow" />
          </div>
          <div className="imageContainer">
            <img
              src={imageUrls[mainImageIndex]}
              alt={`Slide ${mainImageIndex}`}
              loading="lazy"
            />
          </div>
          <div className="arrow" onClick={() => changeSlide('right')}>
            <img src="/arrow.png" alt="Right Arrow" />
          </div>
          <div className="close" onClick={() => setIsFullSliderOpen(false)}>×</div>
        </div>
      )}

      <div className="bigImage">
        <img
          src={imageUrls[mainImageIndex]}
          alt={`Main Preview ${mainImageIndex}`}
          loading="lazy"
          onClick={() => setIsFullSliderOpen(true)}
        />
      </div>

      <div className="smallImage">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            loading="lazy"
            alt={`Thumbnail ${index}`}
            className={index === mainImageIndex ? 'active' : ''}
            onClick={() => setMainImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
