"use client";
import { useState, useRef } from "react";
import { Flex, Input, Typography } from "antd";
import { Mail } from "lucide-react";
import Link from "next/link";
import {  Loader2 } from "lucide-react"; // Loader2 = Spinner
import { motion } from "framer-motion"; 

const { Title } = Typography;
export default function RegisterPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
const [loadingVerify, setLoadingVerify] = useState(false);
const [passwordStrength, setPasswordStrength] = useState("");


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
  setLoadingOtp(true);
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
  } finally {
    setLoadingOtp(false);
  }
}

async function verifyOtp() {
  if (otp.length !== 6) return alert("Enter 6-digit OTP");
  setLoadingVerify(true);
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
  } finally {
    setLoadingVerify(false);
  }
}

// Simple resendOtp = just call sendOtp again
function resendOtp() {
  if (!loadingOtp) sendOtp();
}

function evaluatePasswordStrength(password) {
  let strength = "Weak";

  const strongPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const mediumPattern = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (strongPattern.test(password)) {
    strength = "Strong";
  } else if (mediumPattern.test(password)) {
    strength = "Medium";
  }

  return strength;
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

  const emailError = email && !email.includes("@"); // simple example
const otpError = otp.length > 0 && otp.length < 6;

  return (
   <div className="min-h-screen bg-[url('/background.png')]  bg-center bg-repeat bg-[length:400px_400px]" style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}>

  {/* Header */}
  <header className="flex items-center justify-between px-8 py-4  backdrop-blur-md shadow-md sticky top-0 z-20 border-b border-yellow-300">
    <Link href="/" className="flex items-center gap-2">
      <img src="/tablogo.png" alt="Tab Logo" className="h-10 w-auto -mt-2" />
      <img src="/logo2nd1.png" alt="Main Logo" className="h-10 w-auto" />
    </Link>

    {/* Stepper */}
    <div className="flex items-center gap-3 text-sm font-semibold">
      {["Email Verification", "Personal Info", "Account Info", "Video KYC", "Confirmation"].map(
        (label, index) => {
          const current = index + 1;
          const isActive = current === step;

          return (
            <div
              key={label}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <span className="hidden sm:inline">Step {current}:</span> {label}
            </div>
          );
        }
      )}
    </div>
  </header>

  {/* Main Form Area */}
  <main className="flex justify-center items-start mt-10 px-4">
    <div className="w-full max-w-4xl p-10  relative overflow-hidden">
      <h1 className="kanit text-4xl font-bold text-center mb-8 text-black">
        Register Your Account
      </h1>

      {/* Step 1 */}
   {step === 1 && (
  <div className="bg-white border border-yellow-400 shadow-xl rounded-xl p-6 space-y-6 max-w-md mx-auto transition-all duration-300">
    
    {/* Email Input */}
    <label className="block">
      <span className="text-gray-800 font-medium">Email Address <span className="text-red-500">*</span></span>
      <div className="relative mt-2">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Mail size={18} />
        </span>
        <input
          type="email"
          inputMode="email"
          className={`w-full border ${
            emailError ? "border-red-500" : "border-gray-300"
          } rounded-lg py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 ${
            emailError ? "focus:ring-red-500" : "focus:ring-black"
          } transition-all`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent || loadingOtp}
          placeholder="example@gmail.com"
          required
        />
      </div>
      {emailError && <p className="text-sm text-red-500 mt-1">Please enter a valid email.</p>}
    </label>

    {/* Get OTP Button */}
    {!otpSent ? (
      <button
        onClick={sendOtp}
        disabled={loadingOtp || !email || emailError}
        className={`w-full text-white font-semibold rounded-lg py-2 flex items-center justify-center gap-2 transition-all ${
          loadingOtp
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-900 cursor-pointer"
        }`}
      >
        {loadingOtp && <Loader2 className="animate-spin w-4 h-4" />}
        {loadingOtp ? "Getting OTP..." : "Get OTP"}
      </button>
    ) : (
      <>
        {/* Animated OTP Field */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center">
            <label className="text-gray-800 font-medium">Enter 6-digit OTP <span className="text-red-500">*</span></label>
            <button
              onClick={resendOtp}
              disabled={loadingOtp}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
            >
              Resend OTP
            </button>
          </div>

          <Input.OTP
            length={6}
            value={otp}
            onChange={handleChange}
            formatter={(str) => str.replace(/\D/g, "")}
            inputMode="numeric"
            autoFocus
            className={`mx-auto gap-2 [&>input]:rounded-lg [&>input]:border ${
              otpError ? "border-red-500" : "border-gray-300"
            } [&>input]:focus:ring-black`}
          />
          {otpError && <p className="text-sm text-red-500">OTP must be 6 digits.</p>}
        </motion.div>

        {/* Submit Button */}
        <button
          onClick={verifyOtp}
          disabled={loadingVerify || otp.length < 6}
          className={`w-full mt-4 font-semibold rounded-lg py-2 text-white flex items-center justify-center gap-2 transition-all ${
            loadingVerify
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900 cursor-pointer"
          }`}
        >
          {loadingVerify && <Loader2 className="animate-spin w-4 h-4" />}
          {loadingVerify ? "Submitting..." : "Submit"}
        </button>
      </>
    )}
  </div>
)}



      {/* Step 2 */}
      {step === 2 && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      submitPersonalDetails();
    }}
    className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-yellow-400 max-w-4xl mx-auto mt-8"
  >
    <h2 className="text-2xl font-bold text-black border-b pb-2 border-yellow-300">
      Personal Details
    </h2>

    {/* Name Fields */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">First Name *</label>
        <input
          name="firstName"
          type="text"
          value={personalDetails.firstName}
          onChange={handlePersonalChange}
          required
          className="input-style"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Middle Name</label>
        <input
          name="middleName"
          type="text"
          value={personalDetails.middleName}
          onChange={handlePersonalChange}
          className="input-style"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Last Name *</label>
        <input
          name="lastName"
          type="text"
          value={personalDetails.lastName}
          onChange={handlePersonalChange}
          required
          className="input-style"
        />
      </div>
    </div>

    {/* Phone & DOB */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input
          name="phone"
          type="tel"
          value={personalDetails.phone}
          onChange={handlePersonalChange}
          required
          className="input-style"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
        <input
          name="dob"
          type="date"
          value={personalDetails.dob}
          onChange={handlePersonalChange}
          required
          className="input-style"
        />
      </div>
    </div>

    {/* Address */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Current Address *</label>
      <textarea
        name="address"
        value={personalDetails.address}
        onChange={handlePersonalChange}
        required
        className="input-style min-h-[100px]"
      />
    </div>

    {/* Location Details */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {["state", "country", "city"].map((field) => (
        <div key={field} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
          <input
            name={field}
            type="text"
            value={personalDetails[field]}
            onChange={handlePersonalChange}
            className="input-style"
          />
        </div>
      ))}
    </div>

    {/* Pincode, Police Station, Post Office */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {["pincode", "policeStation", "postOffice"].map((field) => (
        <div key={field} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            name={field}
            type="text"
            value={personalDetails[field]}
            onChange={handlePersonalChange}
            className="input-style"
          />
        </div>
      ))}
    </div>

    {/* Government ID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Government ID Type</label>
        <select
          name="govIdType"
          value={personalDetails.govIdType}
          onChange={handlePersonalChange}
          className="input-style"
        >
          <option value="">Select</option>
          <option value="Aadhar">Aadhar</option>
          <option value="PAN">PAN</option>
          <option value="Driving License">Driving License</option>
          <option value="Passport">Passport</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Government ID Number</label>
        <input
          name="govIdNumber"
          type="text"
          value={personalDetails.govIdNumber}
          onChange={handlePersonalChange}
          className="input-style"
        />
      </div>
    </div>

    {/* ID Upload */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Upload ID Front</label>
        <input
          name="govIdFront"
          type="file"
          accept="image/*"
          onChange={handlePersonalChange}
          className="input-style file:border-none file:bg-yellow-400 file:text-black file:font-medium"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Upload ID Back</label>
        <input
          name="govIdBack"
          type="file"
          accept="image/*"
          onChange={handlePersonalChange}
          className="input-style file:border-none file:bg-yellow-400 file:text-black file:font-medium"
        />
      </div>
    </div>

    {/* Terms */}
    <label className="flex items-start gap-2 text-sm font-medium text-gray-800">
      <input
        name="termsAccepted"
        type="checkbox"
        checked={personalDetails.termsAccepted}
        onChange={handlePersonalChange}
        required
        className="mt-1 accent-yellow-500"
      />
      <span>I accept the Terms and Conditions *</span>
    </label>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full mt-4 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-md transition-all cursor-pointer"
    >
      Next
    </button>
  </form>
)}


      {/* Step 3 */}
      {step === 3 && (
  <form
    className="space-y-8 bg-white p-6 md:p-10 rounded-lg shadow border border-yellow-300"
    onSubmit={(e) => {
      e.preventDefault();
      submitAccountDetails();
    }}
  >
    <h2 className="text-2xl font-bold border-b pb-2 text-black">Account Details</h2>

    {/* Account Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Account Type *
      </label>
      <select
        name="accountType"
        value={accountDetails.accountType}
        onChange={handleAccountChange}
        className="input-style"
        required
      >
        <option value="">Select</option>
        <option value="Savings">Savings Account</option>
        <option value="Current">Current Account</option>
        <option value="Salary">Salary Account</option>
      </select>
    </div>

    {/* Nominee Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nominee Name *
        </label>
        <input
          type="text"
          name="nomineeName"
          value={accountDetails.nomineeName}
          onChange={handleAccountChange}
          className="input-style"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nominee Relation *
        </label>
        <input
          type="text"
          name="nomineeRelation"
          value={accountDetails.nomineeRelation}
          onChange={handleAccountChange}
          className="input-style"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nominee Phone
        </label>
        <input
          type="tel"
          name="nomineePhone"
          value={accountDetails.nomineePhone}
          onChange={handleAccountChange}
          className="input-style"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nominee Email
        </label>
        <input
          type="email"
          name="nomineeEmail"
          value={accountDetails.nomineeEmail}
          onChange={handleAccountChange}
          className="input-style"
        />
      </div>
    </div>

    {/* Nominee Address */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Nominee Address
      </label>
      <textarea
        name="nomineeAddress"
        value={accountDetails.nomineeAddress}
        onChange={handleAccountChange}
        className="input-style"
        rows={3}
      />
    </div>

    {/* Password Fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          type="password"
          name="password"
          value={accountDetails.password}
          onChange={(e) => {
            handleAccountChange(e);
            const strength = evaluatePasswordStrength(e.target.value);
            setPasswordStrength(strength);
          }}
          className="input-style"
          required
        />
        {accountDetails.password && (
          <div
            className={`mt-1 text-sm font-medium ${
              passwordStrength === "Strong"
                ? "text-green-600"
                : passwordStrength === "Medium"
                ? "text-yellow-600"
                : "text-red-500"
            }`}
          >
            Password Strength: {passwordStrength}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={accountDetails.confirmPassword}
          onChange={handleAccountChange}
          className="input-style"
          required
        />
      </div>
    </div>

    {/* Submit Button */}
    <div className="pt-4">
      <button
        type="submit"
        className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
      >
        Next
      </button>
    </div>
  </form>
)}


      {/* Step 4 */}
      {step === 4 && (
  <div className="flex flex-col lg:flex-row gap-6 bg-white p-8 rounded-2xl shadow border border-yellow-300 max-w-4xl mx-auto">
    
    {/* Video Verification Column */}
    <div className="flex-1 space-y-4 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-black">Video Verification</h2>

      {!videoStarted ? (
        <button
          onClick={startVideoVerification}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition cursor-pointer"
        >
          Start Video Verification
        </button>
      ) : (
        <video
          ref={videoRef}
          className="w-full rounded-lg shadow-lg bg-black"
          autoPlay
          muted
        />
      )}

      {verificationMessage && (
        <p className="text-center text-green-700 font-semibold mt-2">
          {verificationMessage}
        </p>
      )}
    </div>

    {/* 3D Face Animation Column */}
    

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
    </main>
    
  </div>
  );
}
