"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PendingApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/pending-applications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Application not found");
        return res.json();
      })
      .then(setApp)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAction = async (action) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/pending-applications/${id}/${action}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Action failed");
      alert(`Application ${action}d`);
      router.push("/admin-dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!app) return <p className="p-6">Loading...</p>;



  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>

      {/* Email */}
      <p className="mb-4">
        <strong>Email:</strong> {app.email}
      </p>

      {/* Personal Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
        <ul className="list-disc pl-5">
          {Object.entries(app.personalDetails || {}).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {String(value)}
            </li>
          ))}
        </ul>
      </div>

      {/* Account Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Account Details</h2>
        <ul className="list-disc pl-5">
          {Object.entries(app.accountDetails || {}).map(([key, value]) => (
            key !== "passwordHash" && (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            )
          ))}
        </ul>
      </div>

      {/* Images */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Uploaded Images</h2>
        <div className="grid grid-cols-2 gap-4">
          {app.personalDetails?.govIdFrontUrl && (
            <img src={app.personalDetails.govIdFrontUrl} alt="Gov ID Front" className="w-full border" />
          )}
          {app.personalDetails?.govIdBackUrl && (
            <img src={app.personalDetails.govIdBackUrl} alt="Gov ID Back" className="w-full border" />
          )}
          {app.videoVerificationImageUrls?.map((url, i) => (
            <img key={i} src={url} alt={`Snapshot ${i + 1}`} className="w-full border" />
          ))}
        </div>
      </div>

      {/* Approve/Reject */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => handleAction("approve")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction("reject")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
