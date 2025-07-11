import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaPen, FaEye } from "react-icons/fa6";
import "./table.scss";
import { useNavigate } from "react-router-dom";

function PropertyTable() {
    const [records, setRecords] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const navigate = useNavigate();

    // Fetch listings from Django
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch("/property/listings/");
                const data = await res.json();

                console.log("Fetched listings:", data);

                // Defensive fallback
                const listings = Array.isArray(data) ? data : data?.results || [];

                setRecords(listings);
                setFiltered(listings);
            } catch (error) {
                console.error("Error fetching listings:", error);
                setRecords([]);
                setFiltered([]);
            }
        };

        fetchListings();
    }, []);

    // Filter by search
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();

        const results = records.filter(row =>
            (row.title || "").toLowerCase().includes(query)
        );
        setFiltered(results);
    };

    const columns = [
        {
            name: "Property",
            cell: (row) => (
                <div className="propertyDetails">
                    <img src={row.images?.[0]} alt={row.title} />
                    <div className="detail">
                        <h4>{row.title}</h4>
                        <p>{row.location}</p>
                    </div>
                </div>
            ),
        },
        { name: "Type", selector: (row) => row.property_type, sortable: true },
        { name: "Status", selector: (row) => row.status || "N/A", sortable: true },
        {
            name: "Tenant Name",
            selector: (row) => row.tenant?.name || "-",
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
                <div className="title"><span>All Properties</span></div>
                <input type="search" className="form-control" placeholder="Search..." onChange={handleSearch} />
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
