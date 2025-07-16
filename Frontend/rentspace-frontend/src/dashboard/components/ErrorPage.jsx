import "./StatusPage.scss";

export default function ErrorPage() {
  return (
    <div className="status-page error">
      <h1>❌ Something went wrong!</h1>
      <p>There was an error creating the property. Please try again.</p>
      <a href="/landlord/property/add">Try Again</a>
    </div>
  );
}
