import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetch(`/api/listings/${id}/`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/listings/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    navigate("/dashboard/property");
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="propertyEdit">
      <h2>Edit Property</h2>
      <label>
        Title:
        <input name="title" value={formData.title} onChange={handleChange} />
      </label>
      <label>
        Location:
        <input name="location" value={formData.location} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      {/* Add more fields as needed */}
      <button type="submit">Save Changes</button>
    </form>
  );
}

export default PropertyEdit;
