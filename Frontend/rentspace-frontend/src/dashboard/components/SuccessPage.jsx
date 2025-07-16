import "./StatusPage.scss";

export default function SuccessPage() {
  return (
    <div className="status-page success">
      <h1>✅ Property Created Successfully!</h1>
      <p>Your property has been listed. You can manage or view it from your dashboard.</p>
      <a href="/landlord/property">Go to My Properties</a>
    </div>
  );
}
