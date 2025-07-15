import './card.scss';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Card({ listing }) {
  const {
    id,
    title = 'Untitled Property',
    cover_image,
    location = {},
    price,
    property_type = 'Unknown Type',
  } = listing;

  const formattedLocation = [location.county, location.town, location.estate]
    .filter(Boolean)
    .join(', ') || 'Unknown Location';

  return (
    <div className="card">
      <Link to={`/property/${id}`} className="card-image">
        <img src={cover_image || '/placeholder.jpg'} alt={title} />
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
          <Link to={`/property/${id}`} className="view-btn">View</Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
