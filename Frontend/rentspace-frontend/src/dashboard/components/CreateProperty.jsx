import { useState } from "react";
import "./createProperty.scss";
import axios from "axios";
import {
  FaHome,
  FaMapMarkerAlt,
  FaBuilding,
  FaImages,
} from "react-icons/fa";

export default function CreatePropertyForm({ authToken }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Listing
    title: "",
    description: "",
    property_type: "bedsitter",
    is_verified: false,
    is_vacant: false,

    // Step 2 - Location
    county: "",
    sub_county: "",
    ward: "",
    street_address: "",
    postal_code: "",
    latitude: "",
    longitude: "",

    // Step 3 - Unit
    unit_number: "",
    floor: 1,
    bedrooms: 1,
    bathrooms: 1,
    rent: 0.0,
    is_occupied: false,

    // Step 4 - Images
    images: [],
  });
  const [listingId, setListingId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, images: Array.from(files) });
      setImagePreviews(Array.from(files).map((file) => URL.createObjectURL(file)));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      // 1. Create Location
      const locRes = await axios.post("/api/locations/", {
        county: formData.county,
        sub_county: formData.sub_county,
        ward: formData.ward,
        street_address: formData.street_address,
        postal_code: formData.postal_code,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // 2. Create Listing
      const listRes = await axios.post("/api/listings/", {
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        is_verified: formData.is_verified,
        is_vacant: formData.is_vacant,
        location: locRes.data.id,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const listingId = listRes.data.id;
      setListingId(listingId);

      // 3. Create Unit
      await axios.post("/api/units/", {
        listing: listingId,
        unit_number: formData.unit_number,
        floor: formData.floor,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        rent: formData.rent,
        is_occupied: formData.is_occupied,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // 4. Upload Images
      for (const image of formData.images) {
        const imgData = new FormData();
        imgData.append("property_image", image);
        imgData.append("listing", listingId);

        await axios.post("/api/listing-images/", imgData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Property successfully created!");
      setStep(1);
      setFormData({ ...formData, images: [] });
    } catch (err) {
      console.error(err);
      alert("Error creating property.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2><FaHome /> Property Info</h2>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <select name="property_type" value={formData.property_type} onChange={handleChange}>
              <option value="bedsitter">Bedsitter</option>
              <option value="one_bedroom">1 Bedroom</option>
              <option value="two_bedroom">2 Bedroom</option>
              <option value="studio">Studio</option>
              <option value="mansion">Mansion</option>
              <option value="single_room">Single</option>
              <option value="double_room">Double Room</option>
              <option value="bungalow">Bungalow</option>
            </select>
            <label><input type="checkbox" name="is_verified" checked={formData.is_verified} onChange={handleChange} /> Verified</label>
            <label><input type="checkbox" name="is_vacant" checked={formData.is_vacant} onChange={handleChange} /> Vacant</label>
          </div>
        );
      case 2:
        return (
          <div>
            <h2><FaMapMarkerAlt /> Location</h2>
            <input name="county" value={formData.county} onChange={handleChange} placeholder="County" />
            <input name="sub_county" value={formData.sub_county} onChange={handleChange} placeholder="Sub County" />
            <input name="ward" value={formData.ward} onChange={handleChange} placeholder="Ward" />
            <input name="street_address" value={formData.street_address} onChange={handleChange} placeholder="Street Address" />
            <input name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" />
            <input name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" />
            <input name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" />
          </div>
        );
      case 3:
        return (
          <div>
            <h2><FaBuilding /> Unit</h2>
            <input name="unit_number" value={formData.unit_number} onChange={handleChange} placeholder="Unit Number" />
            <input type="number" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" />
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" />
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" />
            <input type="number" name="rent" value={formData.rent} onChange={handleChange} placeholder="Rent" />
            <label><input type="checkbox" name="is_occupied" checked={formData.is_occupied} onChange={handleChange} /> Occupied</label>
          </div>
        );
      case 4:
        return (
          <div>
            <h2><FaImages /> Upload Images</h2>
            <input type="file" name="images" accept="image/*" multiple onChange={handleChange} />
            <div style={{ display: "flex", gap: "10px" }}>
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} width="100" />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 4) setStep((s) => s + 1);
        else handleSubmit();
      }}
    >
      {renderStep()}
      <div style={{ marginTop: "20px" }}>
        {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)}>Back</button>}
        <button type="submit">{step < 4 ? "Next" : "Create Property"}</button>
      </div>
    </form>
  );
}