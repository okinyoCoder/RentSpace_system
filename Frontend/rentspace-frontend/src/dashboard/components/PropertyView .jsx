import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PropertyView() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/listings/${id}/`);
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property:", err);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div>Loading...</div>;

  return (
    <div className="propertyView">
      <h2>{property.title}</h2>
      <p><strong>Location:</strong> {property.location}</p>
      <p><strong>Type:</strong> {property.property_type}</p>
      <p><strong>Description:</strong> {property.description}</p>
      {/* Show images, rent, tenant, etc. */}
    </div>
  );
}

export default PropertyView;
