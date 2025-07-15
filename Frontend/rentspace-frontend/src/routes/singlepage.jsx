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
import { propertyApi } from "../api/api"; // ✅ Using propertyApi now
import "./singlepage.scss";

function SinglePage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { user } = useContext(AuthContext);
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await propertyApi.get(`listings/${id}/`);
        setListing(res.data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [id]);

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
        {
          headers: {
            Authorization: `Bearer ${user.access}`, // 👈 attach manually
          },
        }
      );

      setBookingStatus("success");
    } catch (err) {
      console.error("Booking Error:", err);
      setBookingStatus("error");
    }
  };

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="singlePage">
      <div className="detail">
        <div className="wrapper">
          <Slider images={listing.images?.map((img) => img.image) || []} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{listing.title}</h1>
                <div className="address">
                  <FaMapMarkerAlt />
                  <span>
                    {listing.location?.county || "Unknown Location"},{" "}
                    {listing.location?.town}, {listing.location?.estate}
                  </span>
                </div>
                <div className="price">Ksh {listing.price}</div>
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
            <div className="feature">
              <FaMoneyBillWave />
              <div className="featureText">
                <span>Property Rent</span>
                <p>{listing.rent_policy || "Payable by 10th"}</p>
              </div>
            </div>
            <div className="feature">
              <FaTrash />
              <div className="featureText">
                <span>Garbage</span>
                <p>{listing.garbage || "Renter is responsible"}</p>
              </div>
            </div>
            <div className="feature">
              <FaTint />
              <div className="featureText">
                <span>Water</span>
                <p>{listing.water || "Renter is responsible"}</p>
              </div>
            </div>
            <div className="feature">
              <FaBolt />
              <div className="featureText">
                <span>Electricity</span>
                <p>{listing.electricity || "Renter is responsible"}</p>
              </div>
            </div>
          </div>

          <p className="title">Sizes</p>
          <div className="listHorizontal">
            <div className="sizes">
              <div className="size">
                <FaArrowsAltH />
                <span>{listing.size || "N/A"} ft</span>
              </div>
              <div className="size">
                <FaBath />
                <span>
                  {listing.bathrooms} bathroom
                  {listing.bathrooms > 1 ? "s" : ""}
                </span>
              </div>
              <div className="size">
                <FaBed />
                <span>
                  {listing.bedrooms} bed
                  {listing.bedrooms > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            {listing.nearby?.map((place, index) => (
              <div className="size" key={index}>
                <FaMapMarkerAlt />
                <span>{place}</span>
              </div>
            ))}
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

export default SinglePage;
