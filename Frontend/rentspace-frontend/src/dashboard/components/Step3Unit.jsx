import React from "react";
import "./Step3Unit.scss";

export default function Step3Unit({ formik }) {
  const { values, handleChange, errors, touched } = formik;

  return (
    <div className="step3-unit">
      <h2 className="step-title">Step 3: Unit Details</h2>

      <div className="form-group">
        <input
          className="form-input"
          name="unit_number"
          value={values.unit_number}
          onChange={handleChange}
          placeholder="Unit Number"
        />
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="number"
          name="floor"
          value={values.floor}
          onChange={handleChange}
          placeholder="Floor"
        />
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="number"
          name="bedrooms"
          value={values.bedrooms}
          onChange={handleChange}
          placeholder="Bedrooms"
        />
        {touched.bedrooms && errors.bedrooms && (
          <div className="error">{errors.bedrooms}</div>
        )}
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="number"
          name="bathrooms"
          value={values.bathrooms}
          onChange={handleChange}
          placeholder="Bathrooms"
        />
        {touched.bathrooms && errors.bathrooms && (
          <div className="error">{errors.bathrooms}</div>
        )}
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="number"
          name="rent"
          value={values.rent}
          onChange={handleChange}
          placeholder="Rent"
        />
        {touched.rent && errors.rent && (
          <div className="error">{errors.rent}</div>
        )}
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_occupied"
            checked={values.is_occupied}
            onChange={handleChange}
          />
          Occupied
        </label>
      </div>
    </div>
  );
}
