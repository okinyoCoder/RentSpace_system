import React from "react";
import "./Step1PropertyInfo.scss";

export default function Step1PropertyInfo({ formik }) {
  const { values, handleChange, errors, touched } = formik;

  return (
    <div className="step-container">
      <h2 className="step-title">Step 1: Property Info</h2>

      <div className="form-group">
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Title"
          className="form-input"
        />
        {touched.title && errors.title && (
          <div className="error-message">{errors.title}</div>
        )}
      </div>

      <div className="form-group">
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Description"
          className="form-textarea"
        />
        {touched.description && errors.description && (
          <div className="error-message">{errors.description}</div>
        )}
      </div>

      <div className="form-group">
        <select
          name="property_type"
          value={values.property_type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="bedsitter">Bedsitter</option>
          <option value="studio">Studio</option>
          <option value="one_bedroom">1 Bedroom</option>
          <option value="two_bedroom">2 Bedroom</option>
          <option value="bungalow">Bungalow</option>
        </select>
      </div>
    </div>
  );
}
