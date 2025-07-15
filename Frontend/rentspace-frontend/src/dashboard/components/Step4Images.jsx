import React from "react";
import "./Step4Images.scss";

export default function Step4Images({ formik }) {
  const { values, setFieldValue } = formik;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFieldValue("images", files);
  };

  return (
    <div className="step4-images">
      <h2 className="step-title">Step 4: Upload Images</h2>

      <div className="upload-group">
        <input
          className="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {values.images && values.images.length > 0 && (
        <div className="preview-container">
          {values.images.map((file, index) => {
            const src = URL.createObjectURL(file);
            return (
              <div className="image-wrapper" key={index}>
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="preview-image"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
