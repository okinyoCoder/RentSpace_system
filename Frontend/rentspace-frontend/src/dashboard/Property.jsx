import React, { useState } from "react";
import PropertyTable from "./components/Properties";
import "./properties.scss";
import CreateProperty from './components/CreateProperty';

export default function Property() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="propertyContainer">
            <div className="header">
                <h2>All Properties</h2>
                <button onClick={() => setShowForm(true)} className="createBtn">
                    + Add New Property
                </button>
            </div>
            <PropertyTable />
            {showForm && <CreateProperty onClose={() => setShowForm(false)} />}
        </div>
    );
}
