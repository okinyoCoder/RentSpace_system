import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./TenantTable.scss";

function Tenant({ onSelectTenant }) {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("/api/landlord/tenants");
        const data = await response.json();
        setRecords(data);
        setFiltered(data);
      } catch (error) {
        console.error("Failed to fetch tenants", error);
      }
    };

    fetchTenants();
  }, []);

  const columns = [
    {
      name: "Date",
      selector: (row) => row.personID,
      sortable: true,
    },
    {
      name: "Property",
      cell: (row) => (
        <div className="propDetail">
          <img src={row.image} alt="" />
          <span>{row.propertyLocation}</span>
        </div>
      ),
    },
    {
      name: "Unit-No",
      selector: (row) => row.unit,
      sortable: true,
    },
    {
      name: "Tenant Name",
      selector: (row) => row.tenantName,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action">
          <button onClick={() => onSelectTenant(row)}>View Detail</button>
        </div>
      ),
    },
  ];

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    const result = records.filter((row) =>
      row.username.toLowerCase().includes(keyword)
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
          placeholder="Search"
          onChange={handleSearch}
        />
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        fixedHeader
        title="Tenants Table"
        pagination
        selectableRows
      />
    </div>
  );
}

export default Tenant;
