import DataTable from "react-data-table-component";
import React, { useState } from "react";

function Table(){

    const columns = [
        {name: "ID", selector: (row) => row.personID, sortable: true,},
        {name: "Full Name", selector: (row) => row.fullName, sortable: true,},
        {name: "Height", selector: (row) => row.height, sortable: true,},
        {name: "eyeColor", selector: (row) => row.eyeColor, sortable: true,},
         ];
    const data = [
        {
           personID: 1,
           fullName: "Kate Shein",
           height: "1.79m",
           eyeColor: "blue",
        },
        {
           personID: 15,
           fullName: "Isabella Thompson",
           height: "1.79m",
           eyeColor: "blue",
        },
    ];
    // definition of the rows constant
    const [records, setRecords] = useState(data);

    function handleSearch(event){
        const newData = data.filter( row =>{
            return row.fullName.toLowerCase().includes(
                event.target.value.toLowerCase()
            )
        })
        setRecords(newData)
    }

    return (
        <div className="container">
            <input type="search" 
            className="form-control-sm border ps-3"
            placeholder="Search"
            onChange={handleSearch}
            />
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