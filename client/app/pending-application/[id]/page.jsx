"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function PendingApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);

  // ✅ State for image modal
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`https://online-bank-server.onrender.com/api/admin/pending-applications/${id}`)
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
        `https://online-bank-server.onrender.com/api/admin/pending-applications/${id}/${action}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Action failed");
      toast.success(`Application ${action}d`);
      router.push("/admin-dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!app) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6  shadow rounded">
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
          {Object.entries(app.accountDetails || {}).map(
            ([key, value]) =>
              key !== "passwordHash" && (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              )
          )}
        </ul>
      </div>

      {/* Images */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Uploaded Images</h2>
        <div className="grid grid-cols-2 gap-4">
          {app.personalDetails?.govIdFrontUrl && (
            <img
              src={app.personalDetails.govIdFrontUrl}
              alt="Gov ID Front"
              className="w-full border cursor-pointer"
              onClick={() => setSelectedImage(app.personalDetails.govIdFrontUrl)}
            />
          )}
          {app.personalDetails?.govIdBackUrl && (
            <img
              src={app.personalDetails.govIdBackUrl}
              alt="Gov ID Back"
              className="w-full border cursor-pointer"
              onClick={() => setSelectedImage(app.personalDetails.govIdBackUrl)}
            />
          )}
          {app.videoVerificationImageUrls?.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Snapshot ${i + 1}`}
              className="w-full border cursor-pointer"
              onClick={() => setSelectedImage(url)}
            />
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

      {/* ✅ Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full Preview"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow"
            />
            <a
              href={selectedImage}
              download
              className="absolute bottom-2 right-2 text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
