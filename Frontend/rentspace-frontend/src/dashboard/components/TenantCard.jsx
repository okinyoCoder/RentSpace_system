import "./tenantcard.scss";

export default function TenantCard({ tenant }) {
    if (!tenant) return null;

    return (
        <div className="tenantCard">
            <div className="cardWrapper">
                <div className="header">
                    <img src={tenant.image || "/assets/avatar.png"} alt={tenant.name} />
                    <h2>{tenant.tenantName}</h2>
                    <p className="location">{tenant.propertyLocation}</p>
                </div>

                <div className="section">
                    <div className="infoBox">
                        <label>Date of Birth</label>
                        <p>{tenant.dob}</p>
                    </div>
                    <div className="infoBox">
                        <label>Age</label>
                        <p>{tenant.age}</p>
                    </div>
                    <div className="infoBox">
                        <label>Email</label>
                        <p>{tenant.email}</p>
                    </div>
                    <div className="infoBox">
                        <label>Phone</label>
                        <p>{tenant.phone}</p>
                    </div>
                </div>

                <div className="section">
                    <div className="infoGroup">
                        <div className="infoBox">
                            <label>Total Income</label>
                            <p>{tenant.income}</p>
                        </div>
                        <div className="infoBox">
                            <label>Payable Rent</label>
                            <p>{tenant.rent}</p>
                        </div>
                    </div>

                    <div className="infoGroup">
                        <div className="infoBox">
                            <label>Occupant</label>
                            <p>{tenant.occupant}</p>
                        </div>
                        <div className="infoBox">
                            <label>Move-in Date</label>
                            <p>{tenant.moveInDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
