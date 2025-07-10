"use client";
import { useState } from "react";
import Link from "next/link";
import { TextField } from "@mui/material";
export default function CustomerCarePage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Simulate progress animation (for demo only)
    setProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      if (prog > 100) {
        clearInterval(interval);
      } else {
        setProgress(prog);
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("description", description);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("http://localhost:5000/api/support", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Your issue has been submitted.");
        setEmail("");
        setSubject("");
        setDescription("");
        setImages([]);
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    }
  };

  


  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('/contact-back.jpg')]">
      <div className="absolute inset-0 bg-black/60 bg-opacity-60 z-0"></div>
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 flex items-center space-x-2"
      >
        <img src="tablogo.png" alt="Logo" className="h-10  w-auto" />
        <img src="logo2nd2.png" alt="Logo" className="h-10 mt-1 w-auto" />
      </Link>

      {/* Top centered heading and paragraph */}
      <div className="relative z-10 pt-4 pb-6 text-center px-1 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-yellow-400 mb-1 drop-shadow-lg">
          Contact Us
        </h1>
        <p className="text-sm text-white max-w-3xl mx-auto drop-shadow-md">
          We're here to help! Please fill out the form to get in touch with our
          customer care team. Provide as much detail as possible, and feel free
          to upload any relevant images.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-end min-h-[calc(100vh-160px)] px-4 pb-12">
        <div className="w-full max-w-md bg-gray-900 text-white bg-opacity-90 backdrop-blur-md p-4 rounded shadow-md md:mr-16 max-h-[600px] ">
          <h2 className="text-2xl font-semibold text-left mb-6 text-yellow-500">
            Send Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white pb-2">
                Registered Email
              </label>
              <TextField
                variant="standard"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                fullWidth
                InputProps={{
                  sx: {
                    color: "white", // Input text
                    "&::placeholder": { color: "white" }, // Placeholder text
                  },
                }}
                InputLabelProps={{
                  sx: { color: "white" }, // Label color
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "yellow", // Underline default
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "yellow", // Underline on hover
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "yellow", // Underline after 
                  },
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white pb-2">
                Subject
              </label>
              <TextField
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                variant="standard" // for a bordered input similar to your `border rounded-md`
                placeholder="Enter your subject"
                InputProps={{
                  sx: {
                    color: "white", // Input text
                    "&::placeholder": { color: "white" }, // Placeholder text
                  },
                }}
                InputLabelProps={{
                  sx: { color: "white" }, // Label color
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "yellow", // Underline default
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "yellow", // Underline on hover
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "yellow", // Underline after 
                  },
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white pb-2">
                Describe the Problem
              </label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-yellow-300 rounded-md resize-none text-white h-20 "
              ></textarea>
            </div>

            <div>
      <label className="block text-sm font-medium text-white pb-2">
        Upload Images (Optional)
      </label>

      {/* Hidden actual input */}
      <input
        id="imageUpload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Custom styled label acts as button */}
      <label
        htmlFor="imageUpload"
        className="flex items-center justify-center cursor-pointer w-full px-2 py-2 border-2 border-yellow-400 border-dashed rounded-md text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors h-10"
      >
        Choose Images
      </label>

      {/* Selected image count */}
      {images.length > 0 && (
        <p className="text-[10px] text-green-400 mt-2">
          {images.length} image{images.length > 1 ? "s" : ""} selected
        </p>
      )}

      {/* Progress bar container */}
      <div className="w-full bg-green-200 rounded-full h-0.5 mt-3 overflow-hidden">
        {/* Progress bar itself */}
        <div
          className="bg-green-500 h-0.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
