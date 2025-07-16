import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaPen, FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { propertyApi } from "../../api/api";
import "./table.scss";

function PropertyTable() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await propertyApi.get("listings/");
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
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
  const customStyles = {
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#333',
        backgroundColor: '#f5f5f5',
        textTransform: 'capitalize',
      },
    },
  };
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
            src={row.images?.[0]?.property_image || "/assets/house.png"}
            alt={row.title || "Property"}
          />
          <div className="detail">
            <h4>{row.title || "Untitled"}</h4>
            <p>
              {row.location
                ? `${row.location.street_address}, ${row.location.ward}, ${row.location.county}`
                : "Unknown location"}
            </p>
          </div>
        </div>
      ),
      width: "320px",
    },
    {
      name: "Type",
      selector: (row) => row.property_type || "-",
      sortable: true,
    },
    {
      name: "Verified",
      selector: (row) => (row.is_verified ? "✅ Yes" : "❌ No"),
      sortable: true,
    },
    {
      name: "Approval",
      selector: (row) =>
        `${row.approved_units || 0}/${row.pending_units || 0} pending`,
    },
    {
      name: "Occupancy",
      selector: (row) =>
        row.unit_count
          ? `${row.occupied_count}/${row.unit_count} occupied`
          : "N/A",
      sortable: false,
    },
    {
      name: "Rating",
      selector: (row) =>
        row.avg_rating
          ? `${row.avg_rating.toFixed(1)} ★ (${row.review_count})`
          : "No reviews",
      sortable: true,
    },
    {
      name: "Actions",
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
      width: "160px",
    }
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
        highlightOnHover
        responsive
        customStyles={customStyles}
      />
    </div>
  );
}

export default PropertyTable;
