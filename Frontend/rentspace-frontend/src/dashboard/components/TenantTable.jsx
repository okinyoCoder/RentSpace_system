import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { propertyApi } from "../../api/api";

import "./TenantTable.scss";


function TenantTable({ onSelectTenant }) {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const fetchTenants = async () => {
    try {
      const response = await propertyApi.get("landlord/tenants/");
      console.log("Tenants API response:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setRecords(data);
      setFiltered(data);
    } catch (error) {
      console.error("Failed to fetch tenants", error);
      setRecords([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const approveTenant = async (unitId) => {
    try {
      await propertyApi.post(`landlord/tenants/approve/${unitId}/`);
      alert("Tenant approved successfully");
      fetchTenants(); // Refresh data
    } catch (error) {
      console.error("Approval failed", error);
      alert("Approval failed");
    }
  };

  const columns = [
    {
      name: "Tenant Name",
      selector: (row) => row?.tenant?.full_name || "N/A",
      sortable: true,
    },
    {
      name: "Property",
      cell: (row) => (
        <div className="propDetail">
          <img
            src={row.listing_image || "/assets/house.png"}
            alt="Property"
          />
          <span>{row.listing_title || "Untitled"}</span>
        </div>
      ),
    },
    {
      name: "Unit-No",
      selector: (row) => row?.unit_number || "N/A",
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
            <button className="approveBtn" onClick={() => approveTenant(row.id)}>
              Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();

    const result = records.filter((row) => {
      const name = row.tenant?.full_name?.toLowerCase() || "";
      const email = row.tenant?.email?.toLowerCase() || "";
      const unit = row.unit_number?.toLowerCase() || "";
      const property = row.property_name?.toLowerCase() || "";

      return (
        name.includes(keyword) ||
        email.includes(keyword) ||
        unit.includes(keyword) ||
        property.includes(keyword)
      );
    });

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

export default TenantTable
