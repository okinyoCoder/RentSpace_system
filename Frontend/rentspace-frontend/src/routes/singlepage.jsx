import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Slider from "../components/Slider";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTrash,
  FaTint,
  FaBolt,
  FaArrowsAltH,
  FaBath,
  FaBed,
  FaMap,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../auth/AuthContext";
import { propertyApi } from "../api/api";
import "./singlepage.scss";

function SinglePage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const { user } = useContext(AuthContext);

  const isValidId = /^[0-9a-fA-F\-]{36}$/.test(id);

  useEffect(() => {
    if (!isValidId) {
      setError("Invalid property ID.");
      return;
    }

    const fetchListing = async () => {
      try {
        const res = await propertyApi.get(`listings/${id}/`);
        setListing(res.data);
      } catch (error) {
        setError("Property not found.");
      }
    };

    fetchListing();
  }, [id, isValidId]);

  const handleBookingRequest = async () => {
    if (!user?.access) {
      setBookingStatus("unauthorized");
      return;
    }

    try {
      setBookingStatus("loading");
      await propertyApi.post(
        `listings/${id}/book/`,
        { message: "I'd like to book this property." },
        { headers: { Authorization: `Bearer ${user.access}` } }
      );
      setBookingStatus("success");
    } catch {
      setBookingStatus("error");
    }
  };

  if (error) return <Navigate to="/not-found" replace />;
  if (!listing) return <div className="singlepage__loading">Loading...</div>;

  const {
    title,
    description,
    property_type,
    avg_rating,
    review_count,
    is_verified,
    images = [],
    user: owner,
    location,
    units = [],
  } = listing;

  const formattedLocation = location
    ? `${location.street_address || ""}, ${location.ward}, ${location.sub_county}, ${location.county}, ${location.postal_code || ""}`
    : "Location not specified";

  return (
    <div className="singlePage">
      <div className="detail">
        <div className="wrapper">
          <Slider images={images.map(img => img.property_image)} />
          <div className="info">
            <div className="top">
              <div className="post">
                 <h1>
                  {title}{" "}
                  {is_verified && <span className="verified-badge">✔ Verified</span>}
                </h1>
                <div className="address">
                  <FaMapMarkerAlt />
                  <span>
                    {formattedLocation}
                  </span>
                </div>
                <div className="singlepage__meta">
                  <span className="property-type">
                    {property_type.replace("_", " ")}
                  </span>
                  <span className="rating">
                    ⭐ {avg_rating.toFixed(1)} ({review_count} reviews)
                  </span>
                </div>
              </div>
              <div className="user">
                {listing.user?.avatar ? (
                  <img src={listing.user.avatar} alt="User Avatar" />
                ) : (
                  <FaUserCircle size={50} />
                )}
                <span>{listing.user?.name}</span>
              </div>
            </div>
            <div className="bottom">
              {listing.description || "No description provided."}
            </div>

            {user?.role === "tenant" && (
              <div className="booking-button">
                <button
                  onClick={handleBookingRequest}
                  disabled={bookingStatus === "loading"}
                >
                  {bookingStatus === "loading" ? "Sending..." : "Book Now"}
                </button>

                {bookingStatus === "success" && (
                  <p className="success-msg">Booking request sent successfully!</p>
                )}
                {bookingStatus === "error" && (
                  <p className="error-msg">Failed to send booking request. Try again.</p>
                )}
                {bookingStatus === "unauthorized" && (
                  <p className="error-msg">Please log in to book a property.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <Feature icon={<FaMoneyBillWave />} label="Property Rent" value={listing.rent_policy} />
            <Feature icon={<FaTrash />} label="Garbage" value={listing.garbage} />
            <Feature icon={<FaTint />} label="Water" value={listing.water} />
            <Feature icon={<FaBolt />} label="Electricity" value={listing.electricity} />
          </div>

          <p className="title">Sizes</p>
          <div className="listHorizontal">
            <Size icon={<FaArrowsAltH />} text={`${listing.size || "N/A"} ft`} />
            <Size icon={<FaBath />} text={`${listing.bathrooms} bathroom${listing.bathrooms > 1 ? "s" : ""}`} />
            <Size icon={<FaBed />} text={`${listing.bedrooms} bed${listing.bedrooms > 1 ? "s" : ""}`} />
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            {listing.nearby?.length > 0 ? (
              listing.nearby.map((place, i) => (
                <Size key={i} icon={<FaMapMarkerAlt />} text={place} />
              ))
            ) : (
              <p>No nearby places listed.</p>
            )}
          </div>

          <p className="title">Units</p>
          <div className="unitsList">
            {listing.units?.length > 0 ? (
              listing.units.map((unit) => (
                <div className={`unit-card ${unit.is_occupied ? "occupied" : "available"}`} key={unit.id}>
                  <p><strong>Unit:</strong> {unit.unit_number} (Floor {unit.floor})</p>
                  <p>
                    <FaBed /> {unit.bedrooms} beds &nbsp; <FaBath /> {unit.bathrooms} baths
                  </p>
                  <p>
                    <FaMoneyBillWave /> Ksh {Number(unit.rent).toLocaleString()}
                  </p>
                  <p>
                    Status:{" "}
                    <span className={`unit-status ${unit.status}`}>
                      {unit.status}
                    </span>{" "}
                    - {unit.is_occupied ? "Occupied" : "Available"}
                  </p>
                  {unit.tenant && (
                    <p className="tenant-info">
                      Rented by: {unit.tenant.username || "Unknown"}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No units listed for this property.</p>
            )}
          </div>

          <p className="title">Location</p>
          <div className="button">
            <button>
              <FaMap />
              View on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label, value }) {
  return (
    <div className="feature">
      {icon}
      <div className="featureText">
        <span>{label}</span>
        <p>{value || "N/A"}</p>
      </div>
    </div>
  );
}

function Size({ icon, text }) {
  return (
    <div className="size">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default SinglePage;
