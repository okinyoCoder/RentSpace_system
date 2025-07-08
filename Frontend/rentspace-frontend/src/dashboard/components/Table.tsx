import DataTable from "react-data-table-component";
import React, { useState } from "react";
import"./table.scss"
import { FaPen, FaEye } from "react-icons/fa6";

function Table() {

    const columns = [
        {
            name: "Property",
            cell: (row) => (
                <div className="propertyDetails">
                    <img src="" alt="" />
                    <div className="detail">
                        <h4>{row.propertyName}</h4>
                        <p>{row.location}</p>
                    </div>
                </div>
            ),
        },
        { name: "Unit", selector: (row) => row.unit, sortable: true, },
        { name: "Type", selector: (row) => row.type, sortable: true, },
        { name: "Status", selector: (row) => row.status, sortable: true, },
        { name: "Tenant Name", selector: (row) => row.tenantName, sortable: true, },
        {
            name: "Action",
            width: "160px",
            cell: (row) => <div className="action">
                <button><FaPen className="icon" /> Edit</button>
                <button><FaEye className="icon" /> View</button>
            </div>
        },
    ];
    const data = [
        {
            propertyName: "Westwood Apartments",
            location: "Kileleshwa, Nairobi",
            unit: "A-101",
            type: "1 Bedroom",
            status: "Occupied",
            tenantName: "Alice Wanjiku",
            image: "/assets/properties/westwood.png",
        },
        {
            propertyName: "Palm Heights",
            location: "Ruiru, Kiambu",
            unit: "B-304",
            type: "Studio",
            status: "Vacant",
            tenantName: "-",
            image: "/assets/properties/palm.png",
        },
        {
            propertyName: "Greenspan Court",
            location: "Donholm, Nairobi",
            unit: "C-205",
            type: "2 Bedroom",
            status: "Occupied",
            tenantName: "Brian Otieno",
            image: "/assets/properties/greenspan.png",
        },
        {
            propertyName: "Hillview Estate",
            location: "Ngong, Kajiado",
            unit: "D-110",
            type: "1 Bedroom",
            status: "Pending",
            tenantName: "Cynthia Mwangi",
            image: "/assets/properties/hillview.png",
        },
        {
            propertyName: "Cityscape Towers",
            location: "Upper Hill, Nairobi",
            unit: "E-501",
            type: "3 Bedroom",
            status: "Occupied",
            tenantName: "David Kimani",
            image: "/assets/properties/cityscape.png",
        },
    ];
    // definition of the rows constant
    const [records, setRecords] = useState(data);

    function handleSearch(event) {
        const newData = data.filter(row => {
            return row.propertyName.toLowerCase().includes(
                event.target.value.toLowerCase()
            )
        })
        setRecords(newData)
    }

    return (
        <div className="container">
            <div className="top">
                <div className="title">
                    <span>All Property</span>
                </div>
                <input type="search" className="form-control" placeholder="Search" onChange={handleSearch}/>
            </div>
            <DataTable
                columns={columns}
                data={records}
                fixedHeader
                title="React-Data-Table-Component Tutorial"
                pagination
                selectableRows
            />
        </div>
    );
}

export default Table;