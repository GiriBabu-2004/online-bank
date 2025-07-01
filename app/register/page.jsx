"use client";
import { useState, useEffect, useRef } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  // Step 1 - Email & OTP
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Step 2 - Personal Details
  const [personalDetails, setPersonalDetails] = useState({
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

  // Step 3 - Account Details
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

  // Step 4 - Video Verification
  const [videoStarted, setVideoStarted] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const videoRef = useRef();

  // Fake send OTP function
  function sendOtp() {
    if (!email) return alert("Please enter your email");
    // Here you would call your backend API to send OTP
    setOtpSent(true);
    alert(`OTP sent to ${email}`);
  }

  // Fake verify OTP function
  function verifyOtp() {
    // Here you would verify the OTP entered with backend
    if (otp.length !== 6) return alert("Enter 6-digit OTP");
    setOtpVerified(true);
    setStep(2);
  }

  // Handle personal details change
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

  // Handle account details change
  function handleAccountChange(e) {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({ ...prev, [name]: value }));
  }

  // Start video & take snapshot
  function startVideoVerification() {
    setVideoStarted(true);
    setVerificationMessage("");

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // After 1 minute stop video and show verification message
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          setVerificationMessage(
            "Your application is under verification. Please wait for 48 hours. You will be notified by email."
          );
          setStep(5); // Consider step 5 as confirmation page
        }, 60000); // 60 seconds
      })
      .catch((err) => alert("Cannot access camera: " + err.message));
  }

  // Submit personal details
  function submitPersonalDetails() {
    // Validation example: Required fields
    if (!personalDetails.firstName || !personalDetails.lastName || !personalDetails.phone || !personalDetails.dob || !personalDetails.address || !personalDetails.termsAccepted) {
      alert("Please fill all required fields and accept terms.");
      return;
    }
    setStep(3);
  }

  // Submit account details
  function submitAccountDetails() {
    // Basic validation
    if (!accountDetails.accountType || !accountDetails.nomineeName || !accountDetails.password || accountDetails.password !== accountDetails.confirmPassword) {
      alert("Please fill all required fields and ensure passwords match.");
      return;
    }
    setStep(4);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Register Your Account</h1>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <label className="block">
            <span>Email Address *</span>
            <input
              type="email"
              className="w-full border rounded p-2 mt-1"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={otpSent}
              required
            />
          </label>

          {!otpSent ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={sendOtp}
            >
              Register
            </button>
          ) : (
            <>
              <label className="block">
                <span>Enter 6-digit OTP *</span>
                <input
                  type="text"
                  className="w-full border rounded p-2 mt-1"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                />
              </label>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
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
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); submitPersonalDetails(); }}>
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
              Middle Name<br />
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
              State<br />
              <input
                name="state"
                type="text"
                value={personalDetails.state}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label>
              Country<br />
              <input
                name="country"
                type="text"
                value={personalDetails.country}
                onChange={handlePersonalChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label>
              City<br />
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
            Pincode<br />
            <input
              name="pincode"
              type="text"
              value={personalDetails.pincode}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Police Station<br />
            <input
              name="policeStation"
              type="text"
              value={personalDetails.policeStation}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Post Office<br />
            <input
              name="postOffice"
              type="text"
              value={personalDetails.postOffice}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Government ID Type<br />
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
            Government ID Number<br />
            <input
              name="govIdNumber"
              type="text"
              value={personalDetails.govIdNumber}
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Upload Government ID Front<br />
            <input
              name="govIdFront"
              type="file"
              accept="image/*"
              onChange={handlePersonalChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Upload Government ID Back<br />
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

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Next
          </button>
        </form>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); submitAccountDetails(); }}>
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
            Nominee Address<br />
            <textarea
              name="nomineeAddress"
              value={accountDetails.nomineeAddress}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Nominee Phone<br />
            <input
              name="nomineePhone"
              type="tel"
              value={accountDetails.nomineePhone}
              onChange={handleAccountChange}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Nominee Email<br />
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

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
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
          <p>Your application is under verification. Please wait for 48 hours. You will be notified via email once your account is active.</p>
        </div>
      )}
    </div>
  );
}
