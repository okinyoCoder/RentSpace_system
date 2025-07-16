import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaPen, FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { propertyApi } from "../../api/Api"; // ✅ correct usage
import "./table.scss";

function PropertyTable() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await propertyApi.get("listings/");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];
        setRecords(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setRecords([]);
        setFiltered([]);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const result = records.filter((row) =>
      (row.title || "").toLowerCase().includes(query)
    );
    setFiltered(result);
  };

  const columns = [
    {
      name: "Property",
      cell: (row) => (
        <div className="propertyDetails">
          <img
            src={row.images?.[0] || "/assets/house.png"}
            alt={row.title || "Property"}
          />
          <div className="detail">
            <h4>{row.title || "Untitled"}</h4>
            <p>{row.location || "Unknown location"}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row) => row.property_type || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "N/A",
      sortable: true,
    },
    {
      name: "Tenant Name",
      selector: (row) =>
        row.tenant?.name || row.tenant?.full_name || "No tenant",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action">
          <button onClick={() => navigate(`/landlord/property/edit/${row.id}`)}>
            <FaPen className="icon" /> Edit
          </button>
          <button onClick={() => navigate(`/landlord/property/${row.id}`)}>
            <FaEye className="icon" /> View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="top">
        <div className="title">
          <span>All Properties</span>
        </div>
        <input
          type="search"
          className="form-control"
          placeholder="Search..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        selectableRows
        fixedHeader
      />
    </div>
  );
}

export default PropertyTable;
