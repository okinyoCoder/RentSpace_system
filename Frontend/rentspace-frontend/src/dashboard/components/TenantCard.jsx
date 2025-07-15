import "./tenantcard.scss";
import { useState } from "react";
import  {propertyApi}  from "../../api/Api";

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
      await propertyApi.post("messages/", {
        recipient_id: tenant.user_id,
        message,
      });
      setMessageStatus("Message sent!");
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageStatus("Failed to send message.");
    }
  };

  return (
    <div className="tenantCard">
      <div className="cardWrapper">
        <div className="header">
          <img src={tenant.image || "/assets/avatar.png"} onError={(e) => e.target.src = "/assets/avatar.png"} />
          <h2>{tenant.tenant?.full_name || "N/A"}</h2>
          <p className="location"><FaBuilding /> {tenant.propertyLocation}</p>
          {tenant.is_approved === false && (
            <p className="pending"><FaKey /> Approval Pending</p>
          )}
        </div>

        <div className="section">
          <Info label="Email" icon={<FaEnvelope />} value={tenant.email} />
          <Info label="Phone" icon={<FaPhone />} value={tenant.phone} />
          <Info label="Unit" icon={<FaHome />} value={tenant.unit_number || "N/A"} />
          <Info label="Property" icon={<FaBuilding />} value={tenant.property_name} />
          <Info label="Move-in Date" icon={<FaCalendarCheck />} value={tenant.moveInDate} />
          <Info label="Occupants" icon={<FaUsers />} value={tenant.occupant} />
          <Info label="Income" icon={<FaMoneyBillWave />} value={tenant.income} />
          <Info label="Rent" icon={<FaMoneyBillWave />} value={tenant.rent} />
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

function Info({ label, icon, value }) {
  return (
    <div className="infoBox">
      <label>{icon} {label}</label>
      <p>{value}</p>
    </div>
  );
}
