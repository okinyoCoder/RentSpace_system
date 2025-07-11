import React, { useEffect, useState } from "react";
import axios from "axios";

import "./tenant.scss";
import Tenant from "./components/Tenant";
import TenantCard from "./components/TenantCard";
import {
  FaBuilding,
  FaPeopleGroup,
  FaBuildingUser,
} from "react-icons/fa6";

export default function Tenants() {
  const [summary, setSummary] = useState({
    totalProperties: 0,
    totalTenants: 0,
    pendingApproval: 0,
  });

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("/property/landlord/dashboard-summary");
        setSummary(response.data);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="tenantContainer">
      <div className="table">
        <div className="summary">
          <div className="sumBox">
            <p>Total Properties</p>
            <div className="icon"><FaBuilding /></div>
            <h3>{summary.totalProperties}</h3>
          </div>
          <div className="sumBox">
            <p>Total Tenants</p>
            <div className="icon"><FaPeopleGroup /></div>
            <h3>{summary.totalTenants}</h3>
          </div>
          <div className="sumBox">
            <p>Pending Approval</p>
            <div className="icon"><FaBuildingUser /></div>
            <h3>{summary.pendingApproval}</h3>
          </div>
        </div>

        <Tenant onSelectTenant={setSelectedTenant} />
      </div>

      <div className="userProfile">
        {selectedTenant ? (
          <TenantCard tenant={selectedTenant} />
        ) : (
          <div className="no-selection">Select a tenant to view details</div>
        )}
      </div>
    </div>
  );
}
