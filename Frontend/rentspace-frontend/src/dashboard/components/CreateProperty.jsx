import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Step1 from "./Step1PropertyInfo";
import Step2 from "./Step2Location";
import Step3 from "./Step3Unit";
import Step4 from "./Step4Images";
import StepProgress from "./StepProgress";
import { ToastContainer, toast } from "react-toastify";
import { propertyApi } from "../../api/api";
import "react-toastify/dist/ReactToastify.css";
import "./CreateProperty.scss";

const steps = [Step1, Step2, Step3, Step4];

const validationSchemas = [
  Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    property_type: Yup.string().required("Type is required"),
  }),
  Yup.object({
    county: Yup.string().required("County is required"),
    latitude: Yup.number().typeError("Latitude must be a number"),
    longitude: Yup.number().typeError("Longitude must be a number"),
  }),
  Yup.object({
    bedrooms: Yup.number().min(1).required(),
    bathrooms: Yup.number().min(1).required(),
    rent: Yup.number().min(0).required(),
  }),
  Yup.object({}),
];

const getInitialValues = () => ({
  title: "",
  description: "",
  property_type: "bedsitter",
  is_verified: false,
  county: "",
  sub_county: "",
  ward: "",
  street_address: "",
  postal_code: "",
  latitude: "",
  longitude: "",
  unit_number: "",
  floor: 1,
  bedrooms: 1,
  bathrooms: 1,
  rent: 0,
  is_occupied: false,
  images: [],
});

export default function CreatePropertyForm() {
  const [step, setStep] = useState(0);
  const StepComponent = steps[step];
  const navigate = useNavigate();

const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    const listRes = await propertyApi.post("listings/", {
      title: values.title,
      description: values.description,
      property_type: values.property_type,
      is_verified: values.is_verified,
      location: {
        county: values.county,
        sub_county: values.sub_county,
        ward: values.ward,
        street_address: values.street_address,
        postal_code: values.postal_code,
        latitude: parseFloat(values.latitude) || null,
        longitude: parseFloat(values.longitude) || null,
      }
    });

    const listingId = listRes.data.id;

    await propertyApi.post("units/", {
      listing: listingId,
      unit_number: values.unit_number,
      floor: values.floor,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      rent: values.rent,
      is_occupied: values.is_occupied,
    });

    for (const image of values.images) {
      const formData = new FormData();
      formData.append("property_image", image);
      formData.append("listing", listingId);
      await propertyApi.post("listing-images/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    toast.success("✅ Property created!");
    resetForm();
    setStep(0);
    setTimeout(() => navigate("/landlord/property/success"), 1200);
  } catch (err) {
    console.error(err);
    toast.error("❌ Something went wrong");
    setTimeout(() => navigate("/landlord/property/error"), 1500);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchemas[step]}
        onSubmit={(values, actions) => {
          if (step < steps.length - 1) {
            setStep(step + 1);
            actions.setTouched({});
            actions.setSubmitting(false);
          } else {
            handleSubmit(values, actions);
          }
        }}
      >
        {(formik) => (
          <Form className="create-property-form">
            <StepProgress currentStep={step} totalSteps={steps.length} />
            <div className="form-step">
              <StepComponent formik={formik} />
            </div>
            <div className="form-buttons">
              {step > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting}
              >
                {step < steps.length - 1 ? "Next" : "Create Property"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
