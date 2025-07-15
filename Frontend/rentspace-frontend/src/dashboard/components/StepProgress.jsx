import React from "react";
import "./stepProgress.scss";

export default function StepProgress({ currentStep, totalSteps }) {
  return (
    <div className="step-progress">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`step-dot ${index === currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""}`}
        />
      ))}
    </div>
  );
}
