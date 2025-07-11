import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    MapPin,
    Home,
    Info,
    Image as ImageIcon,
    DollarSign,
    Users,
} from "lucide-react";
import "./propertyView.scss";

function PropertyView() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/property/listings/${id}/`);
                const data = await res.json();
                setProperty(data);
            } catch (err) {
                console.error("Failed to fetch property:", err);
            }
        };

        fetchProperty();
    }, [id]);

    if (!property) return <div className="loading">Loading...</div>;

    return (
        <div className="propertyView">
            <h1>{property.title}</h1>

            <section className="section">
                <h2><MapPin size={20} /> Location</h2>
                <p>{property.location?.ward}, {property.location?.sub_county}, {property.location?.county}</p>
                <p>{property.location?.street_address}</p>
            </section>

            <section className="section">
                <h2><Home size={20} /> Property Type</h2>
                <p>{property.property_type.replace("_", " ")}</p>
            </section>

            <section className="section">
                <h2><Info size={20} /> Description</h2>
                <p>{property.description}</p>
            </section>

            <section className="section">
                <h2><DollarSign size={20} /> Units</h2>
                {property.units?.length > 0 ? (
                    <ul className="unit-list">
                        {property.units.map((unit) => (
                            <li key={unit.id}>
                                Unit {unit.unit_number} — Floor {unit.floor} —
                                {unit.bedrooms} Bed / {unit.bathrooms} Bath —
                                Rent: KES {unit.rent}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No units listed.</p>
                )}
            </section>

            <section className="section">
                <h2><ImageIcon size={20} /> Images</h2>
                <div className="image-gallery">
                    {property.images?.length > 0 ? (
                        property.images.map((img) => (
                            <img
                                key={img.id}
                                src={img.property_image}
                                alt="Property"
                                className="property-img"
                            />
                        ))
                    ) : (
                        <p>No images available.</p>
                    )}
                </div>
            </section>

            <section className="section">
                <h2><Users size={20} /> Reviews</h2>
                <p>⭐ {property.avg_rating} average from {property.review_count} reviews</p>
            </section>
        </div>
    );
}

export default PropertyView;
