import './card.scss';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Card({ listing }) {
  const {
    id,
    title = 'Untitled Property',
    images = [],
    location = {},
    units = [],
    property_type = 'Unknown Type',
  } = listing;

  const coverImageSrc = listing.cover_image || images[0]?.property_image || '/placeholder.jpg';
  const price = units[0]?.rent;

  const formattedLocation = [
    location.county,
    location.sub_county,
    location.ward,
    location.street_address,
  ]
    .filter(Boolean)
    .join(', ') || 'Unknown Location';

  return (
    <div className="card">
      <Link to={`/property/${id}`} className="card-image">
        <img src={coverImageSrc} alt={title} />
      </Link>
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/property/${id}`}>{title}</Link>
        </h3>
        <div className="card-location">
          <FaMapMarkerAlt className="icon" />
          <span>{formattedLocation}</span>
        </div>
        <div className="card-price">
          {price ? `Ksh. ${Number(price).toLocaleString()}` : 'Price not listed'}
        </div>
        <div className="card-footer">
          <span className="property-type">{property_type.replace(/_/g, ' ')}</span>
          <Link to={`/property/${id}`} className="view-btn" onClick={() => console.log("navigating to", `/property/${id}`)}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
