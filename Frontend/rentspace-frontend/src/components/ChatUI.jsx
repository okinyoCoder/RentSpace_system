import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import "./ChatUI.scss";

export default function ChatUI({ tenantId, listingId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/api/messages/?tenant=${tenantId}&listing=${listingId}`
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [tenantId, listingId]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const response = await axios.post("/api/messages/", {
        tenant: tenantId,
        listing: listingId,
        message: input,
      });

      setMessages((prev) => [...prev, response.data]);
      setInput("");
    } catch (err) {
      console.error("Message failed", err);
    }
  };

  return (
    <div className="chatBox">
      <div className="chatHeader">Messages</div>
      <div className="chatBody">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chatMessage ${msg.is_sender ? "sent" : "received"}`}
          >
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatInput">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
