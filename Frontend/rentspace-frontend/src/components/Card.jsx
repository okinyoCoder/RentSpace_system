import './card.scss';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Card({ listing }) {
    return (
        <div className="card">
            <Link to={`/property/${listing.id}`} className="card-image">
                <img src={listing.cover_image || '/placeholder.jpg'} alt={listing.title} />
            </Link>
            <div className="card-body">
                <h3 className="card-title">
                    <Link to={`/property/${listing.id}`}>{listing.title}</Link>
                </h3>
                <div className="card-location">
                    <FaMapMarkerAlt className="icon" />
                    <span>{listing.location?.county || 'Unknown Location'}, {listing.location?.town}, {listing.location?.estate}</span>
                </div>
                <div className="card-price">Ksh. {listing.price?.toLocaleString()}</div>
                <div className="card-footer">
                    <span className="property-type">{listing.property_type}</span>
                    <Link to={`/property/${listing.id}`} className="view-btn">View</Link>
                </div>
            </div>
        </div>
    );
}

export default Card;