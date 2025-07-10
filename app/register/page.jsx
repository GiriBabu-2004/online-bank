"use client";
import { useState, useRef } from "react";
import { Flex, Input, Typography } from "antd";
import { Mail } from "lucide-react";

const { Title } = Typography;
export default function RegisterPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [personalDetails, setPersonalDetails] = useState({
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    dob: "",
    address: "",
    state: "",
    country: "",
    city: "",
    pincode: "",
    policeStation: "",
    postOffice: "",
    govIdType: "",
    govIdNumber: "",
    govIdFront: null,
    govIdBack: null,
    termsAccepted: false,
  });

  const [accountDetails, setAccountDetails] = useState({
    accountType: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineeAddress: "",
    nomineePhone: "",
    nomineeEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [videoStarted, setVideoStarted] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const videoRef = useRef();

  // Send OTP to email
  async function sendOtp() {
    if (!email) return alert("Please enter your email");
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent to your email.");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      alert("Error sending OTP: " + err.message);
    }
  }

  // Verify OTP
  async function verifyOtp() {
    if (otp.length !== 6) return alert("Enter 6-digit OTP");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      console.log("OTP Verify Response:", data); // ✅ log backend response

      if (res.ok) {
        setOtpVerified(true);
        setStep(2); // ✅ move to Step 2
        setPersonalDetails((prev) => ({ ...prev, email }));
      } else {
        alert(data.error || "OTP verification failed");
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);
      alert("Network error: " + err.message);
    }
  }

  function handlePersonalChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setPersonalDetails((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setPersonalDetails((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setPersonalDetails((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleAccountChange(e) {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({ ...prev, [name]: value }));
  }

  // Submit personal details with files
  async function submitPersonalDetails() {
    const requiredFields = ["firstName", "lastName", "phone", "dob", "address"];
    for (let field of requiredFields) {
      if (!personalDetails[field]) {
        return alert("Please fill all required fields.");
      }
    }
    if (!personalDetails.termsAccepted)
      return alert("Please accept terms and conditions.");
    console.log(
      "Submitting personal details with email:",
      personalDetails.email
    );
    const formData = new FormData();

    // Append regular text fields
    for (let key in personalDetails) {
      if (personalDetails[key] != null) {
        // Skip file fields here, handled separately
        if (key === "govIdFront" || key === "govIdBack") continue;

        if (personalDetails[key] instanceof Date) {
          formData.append(key, personalDetails[key].toISOString());
        } else {
          formData.append(key, personalDetails[key]);
        }
      }
    }

    // Append files if present
    if (personalDetails.govIdFront instanceof File) {
      formData.append("govIdFront", personalDetails.govIdFront);
    }
    if (personalDetails.govIdBack instanceof File) {
      formData.append("govIdBack", personalDetails.govIdBack);
    }

    // Append email (must be present)
    if (personalDetails.email) {
      formData.append("email", personalDetails.email);
    } else {
      return alert("User email missing!");
    }

    try {
      const res = await fetch(`${API_BASE}/api/register/personal-details`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStep(3);
      } else {
        alert(data.error || data.message || "Failed to save personal details");
      }
    } catch (err) {
      alert("Error submitting personal details: " + err.message);
    }
  }

  // Submit account details
  async function submitAccountDetails() {
    const { accountType, nomineeName, password, confirmPassword } =
      accountDetails;
    const emailFromPersonalDetails = personalDetails.email;

    if (
      !emailFromPersonalDetails ||
      !accountType ||
      !nomineeName ||
      !password ||
      password !== confirmPassword
    ) {
      alert("Please complete required fields and ensure passwords match.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/register/account-details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...accountDetails,
            email: emailFromPersonalDetails,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStep(4);
      } else {
        alert(data.error || "Failed to save account details");
      }
    } catch (err) {
      alert("Error submitting account details: " + err.message);
    }
  }

  // Start camera and capture snapshot after timeout
  function startVideoVerification() {
    setVideoStarted(true);
    setVerificationMessage("");

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();

          let snapshots = [];
          let captureCount = 0;

          const interval = setInterval(() => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext("2d").drawImage(video, 0, 0);

              canvas.toBlob((blob) => {
                if (blob) {
                  snapshots.push(blob);
                  captureCount++;
                }

                if (captureCount >= 5) {
                  clearInterval(interval);
                  stream.getTracks().forEach((track) => track.stop());
                  uploadSnapshots(snapshots);
                }
              }, "image/jpeg");
            }
          }, 6000); // Take snapshot every 6 seconds (5 times in 30 seconds)
        };
      })
      .catch((err) => alert("Cannot access camera: " + err.message));
  }

  function uploadSnapshots(blobs) {
    if (!personalDetails.email) {
      alert("Email missing, cannot upload verification");
      return;
    }

    const formData = new FormData();
    blobs.forEach((blob, index) => {
      formData.append(
        `videoImage${index + 1}`,
        blob,
        `snapshot${index + 1}.jpg`
      );
    });
    formData.append("email", personalDetails.email);

    fetch(`${API_BASE}/api/register/video-verification`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setVerificationMessage(
            "Your application is under verification. Please wait for 48 hours."
          );
          setStep(5);
        } else {
          alert(data.message || "Verification upload failed.");
        }
      })
      .catch((err) => {
        alert("Error uploading video snapshots: " + err.message);
      });
  }

  const handleChange = (value) => {
    setOtp(value);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="kanit text-3xl font-bold text-center mb-8">
        Register Your Account
      </h1>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <label className="block">
            <span>Email Address *</span>
              <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <Mail size={18} />
            </span>
            <input
              type="email"
              className="w-full border rounded p-2 mt-1 pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
              placeholder="example@gmail.com"
              required
            />
            </div>
          </label>

          {!otpSent ? (
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={sendOtp}
            >
              Get OTP
            </button>
          ) : (
            <>
              <Flex gap="middle" align="flex-start" vertical>
                <Title level={5}>Enter 6-digit OTP *</Title>
                <Input.OTP
                  length={6}
                  value={otp}
                  onChange={handleChange}
                  formatter={(str) => str.replace(/\D/g, "")} // Only digits
                  inputMode="numeric"
                />
              </Flex>
              <button
                className="bg-green-600 text-white mt-4 px-4 py-2 rounded"
                onClick={verifyOtp}
              >
                Submit
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            submitPersonalDetails();
          }}
        >
          <h2 className="text-xl font-semibold">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label>
              First Name *<br />
              <input
                name="firstName"
                type="text"
                value={personalDetails.firstName}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
                required
              />
            </label>
            <label>
              Middle Name
              <br />
              <input
                name="middleName"
                type="text"
                value={personalDetails.middleName}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label>
              Last Name *<br />
              <input
                name="lastName"
                type="text"
                value={personalDetails.lastName}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
                required
              />
            </label>
          </div>

          <label>
            Phone Number *<br />
            <input
              name="phone"
              type="tel"
              value={personalDetails.phone}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>

          <label>
            Date of Birth *<br />
            <input
              name="dob"
              type="date"
              value={personalDetails.dob}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>

          <label>
            Current Address *<br />
            <textarea
              name="address"
              value={personalDetails.address}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label>
              State
              <br />
              <input
                name="state"
                type="text"
                value={personalDetails.state}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label>
              Country
              <br />
              <input
                name="country"
                type="text"
                value={personalDetails.country}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label>
              City
              <br />
              <input
                name="city"
                type="text"
                value={personalDetails.city}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
              />
            </label>
          </div>

          <label>
            Pincode
            <br />
            <input
              name="pincode"
              type="text"
              value={personalDetails.pincode}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Police Station
            <br />
            <input
              name="policeStation"
              type="text"
              value={personalDetails.policeStation}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Post Office
            <br />
            <input
              name="postOffice"
              type="text"
              value={personalDetails.postOffice}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Government ID Type
            <br />
            <select
              name="govIdType"
              value={personalDetails.govIdType}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select</option>
              <option value="Aadhar">Aadhar</option>
              <option value="PAN">PAN</option>
              <option value="Driving License">Driving License</option>
              <option value="Passport">Passport</option>
            </select>
          </label>

          <label>
            Government ID Number
            <br />
            <input
              name="govIdNumber"
              type="text"
              value={personalDetails.govIdNumber}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Upload Government ID Front
            <br />
            <input
              name="govIdFront"
              type="file"
              accept="image/*"
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Upload Government ID Back
            <br />
            <input
              name="govIdBack"
              type="file"
              accept="image/*"
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              name="termsAccepted"
              type="checkbox"
              checked={personalDetails.termsAccepted}
              onChange={handlePersonalChange}
              required
            />
            <span>I accept the Terms and Conditions *</span>
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Next
          </button>
        </form>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            submitAccountDetails();
          }}
        >
          <h2 className="text-xl font-semibold">Account Details</h2>

          <label>
            Account Type *<br />
            <select
              name="accountType"
              value={accountDetails.accountType}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select</option>
              <option value="Savings">Savings Account</option>
              <option value="Current">Current Account</option>
              <option value="Salary">Salary Account</option>
            </select>
          </label>

          <label>
            Nominee Name *<br />
            <input
              name="nomineeName"
              type="text"
              value={accountDetails.nomineeName}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>

          <label>
            Nominee Relation *<br />
            <input
              name="nomineeRelation"
              type="text"
              value={accountDetails.nomineeRelation}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>

          <label>
            Nominee Address
            <br />
            <textarea
              name="nomineeAddress"
              value={accountDetails.nomineeAddress}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Nominee Phone
            <br />
            <input
              name="nomineePhone"
              type="tel"
              value={accountDetails.nomineePhone}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Nominee Email
            <br />
            <input
              name="nomineeEmail"
              type="email"
              value={accountDetails.nomineeEmail}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Password *<br />
            <input
              name="password"
              type="password"
              value={accountDetails.password}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>

          <label>
            Confirm Password *<br />
            <input
              name="confirmPassword"
              type="password"
              value={accountDetails.confirmPassword}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Next
          </button>
        </form>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Video Verification</h2>
          {!videoStarted && (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded"
              onClick={startVideoVerification}
            >
              Start Video Verification
            </button>
          )}

          {videoStarted && (
            <video ref={videoRef} className="w-full rounded shadow" />
          )}

          {verificationMessage && (
            <p className="text-center text-green-700 font-semibold mt-4">
              {verificationMessage}
            </p>
          )}
        </div>
      )}

      {/* Step 5 - Confirmation */}
      {step === 5 && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p>
            Your application is under verification. Please wait for 48 hours.
            You will be notified via email once your account is active.
          </p>
        </div>
      )}
    </div>
  );
}
