import "./tenantcard.scss";
import { useState } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaHome,
  FaMoneyBillWave,
  FaUsers,
  FaCalendarCheck,
  FaCommentDots,
  FaBuilding,
  FaKey,
} from "react-icons/fa";

export default function TenantCard({ tenant }) {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  if (!tenant) return null;

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const response = await axios.post("/property/messages/", {
        recipient_id: tenant.user_id, 
        message,
      });
      setMessageStatus("Message sent!");
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
      setMessageStatus("Failed to send message.");
    }
  };

  return (
    <div className="tenantCard">
      <div className="cardWrapper">
        <div className="header">
          <img src={tenant.image || "/assets/avatar.png"} alt={tenant.tenantName} />
          <h2>{tenant.tenantName}</h2>
          <p className="location"><FaBuilding /> {tenant.propertyLocation}</p>
          {tenant.is_approved === false && (
            <p className="pending"><FaKey /> Approval Pending</p>
          )}
        </div>

        <div className="section">
          <div className="infoBox">
            <label><FaEnvelope /> Email</label>
            <p>{tenant.email}</p>
          </div>
          <div className="infoBox">
            <label><FaPhone /> Phone</label>
            <p>{tenant.phone}</p>
          </div>
          <div className="infoBox">
            <label><FaHome /> Unit</label>
            <p>{tenant.unit_number || "N/A"}</p>
          </div>
          <div className="infoBox">
            <label><FaBuilding /> Property</label>
            <p>{tenant.property_name}</p>
          </div>
          <div className="infoBox">
            <label><FaCalendarCheck /> Move-in Date</label>
            <p>{tenant.moveInDate}</p>
          </div>
          <div className="infoBox">
            <label><FaUsers /> Occupants</label>
            <p>{tenant.occupant}</p>
          </div>
          <div className="infoBox">
            <label><FaMoneyBillWave /> Income</label>
            <p>{tenant.income}</p>
          </div>
          <div className="infoBox">
            <label><FaMoneyBillWave /> Rent</label>
            <p>{tenant.rent}</p>
          </div>
        </div>

        <div className="section messageSection">
          <h4><FaCommentDots /> Send Message</h4>
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
          {messageStatus && <p className="messageStatus">{messageStatus}</p>}
        </div>
      </div>
    </div>
  );
}
