import React from "react";
import "./Step2Location.scss";

export default function Step2Location({ formik }) {
  const { values, handleChange, errors, touched } = formik;

  return (
    <div className="step-container">
      <h2 className="step-title">Step 2: Location</h2>

      <div className="form-group">
        <input
          name="county"
          value={values.county}
          onChange={handleChange}
          placeholder="County"
          className="form-input"
        />
        {touched.county && errors.county && <div className="error-message">{errors.county}</div>}
      </div>

      <div className="form-group">
        <input
          name="sub_county"
          value={values.sub_county}
          onChange={handleChange}
          placeholder="Sub County"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          name="ward"
          value={values.ward}
          onChange={handleChange}
          placeholder="Ward"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          name="street_address"
          value={values.street_address}
          onChange={handleChange}
          placeholder="Street Address"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          name="postal_code"
          value={values.postal_code}
          onChange={handleChange}
          placeholder="Postal Code"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          name="latitude"
          value={values.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          className="form-input"
          type="text"
        />
        {touched.latitude && errors.latitude && <div className="error-message">{errors.latitude}</div>}
      </div>

      <div className="form-group">
        <input
          name="longitude"
          value={values.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          className="form-input"
          type="text"
        />
        {touched.longitude && errors.longitude && <div className="error-message">{errors.longitude}</div>}
      </div>
    </div>
  );
}
