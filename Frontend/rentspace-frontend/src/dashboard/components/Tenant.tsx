import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import "./TenantTable.scss";

function Tenant({ onSelectTenant }) {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get("/landlord/tenants/");
        console.log("Tenants API response:", response.data); // 🕵️‍♀️ Log it

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || []; // if paginated

        setRecords(data);
        setFiltered(data);
      } catch (error) {
        console.error("Failed to fetch tenants", error);
        setRecords([]);
        setFiltered([]);
      }
    };

    fetchTenants();
  }, []);

  const approveTenant = async (unitId) => {
    try {
      await axios.post(`/property/landlord/tenants/approve/${unitId}/`);
      alert("Tenant approved successfully");

      // Refresh data after approval
      const response = await axios.get("/property/landlord/tenants/approve/${unitId}/");
      const data = response.data;
      setRecords(data);
      setFiltered(data);
    } catch (error) {
      console.error("Approval failed", error);
      alert("Approval failed");
    }
  };

  const columns = [
    {
      name: "Tenant Name",
      selector: (row) => row.tenant?.full_name || "N/A",
      sortable: true,
    },
    {
      name: "Property",
      cell: (row) => (
        <div className="propDetail">
          {row.listing_image ? (
            <img src={row.listing_image} alt="Property" />
          ) : (<img src="/assets/house.png" alt="Default Property" />
)}
          <span>{row.listing_title || "Untitled"}</span>
        </div>
      ),
    },
    {
      name: "Unit-No",
      selector: (row) => row.unit_number || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.is_occupied ? "Approved" : "Pending"),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action">
          <button onClick={() => onSelectTenant(row)}>View Detail</button>
          {!row.is_occupied && (
            <button
              className="approveBtn"
              onClick={() => approveTenant(row.id)}
            >
              Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    const result = records.filter((row) =>
      row.tenant?.full_name?.toLowerCase().includes(keyword)
    );
    setFiltered(result);
  };

  return (
    <div className="container">
      <div className="top">
        <div className="title">All Tenants</div>
        <input
          type="search"
          className="form-control"
          placeholder="Search tenants..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={Array.isArray(filtered) ? filtered : []}
        fixedHeader
        pagination
        selectableRows
        title="Tenants Table"
      />
    </div>
  );
}

export default Tenant;
