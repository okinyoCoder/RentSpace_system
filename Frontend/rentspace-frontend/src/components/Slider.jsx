import { useState } from 'react';
import './slider.scss';

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  if (!Array.isArray(images) || images.length === 0) {
    return <div className="slider">No images available</div>;
  }

  const changeSlide = (direction) => {
    if (direction === 'left') {
      setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div className="fullSlider">
          <div className="arrow" onClick={() => changeSlide('left')}>
            <img src="/arrow.png" alt="Left Arrow" />
          </div>
          <div className="imageContainer">
            <img src={images[imageIndex]} alt={`Slide ${imageIndex}`} />
          </div>
          <div className="arrow" onClick={() => changeSlide('right')}>
            <img src="/arrow.png" alt="Right Arrow" />
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>×</div>
        </div>
      )}

      <div className="bigImage">
        <img
          src={images[0]}
          alt="Main Preview"
          onClick={() => setImageIndex(0)}
        />
      </div>

      <div className="smallImage">
        {images.slice(1).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;