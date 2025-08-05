"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TextField } from "@mui/material";
import { MdEmail } from "react-icons/md";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";
export default function CustomerCarePage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust as needed

    return () => clearTimeout(timeout);
  }, []);
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
    setSubmitting(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("description", description);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("http://online-bank-production.up.railway.app/api/support", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Your issue has been submitted.");
        setEmail("");
        setSubject("");
        setDescription("");
        setImages([]);
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };
if (loading) return <Loader />;
  return (
    <div className="relative min-h-screen w-full bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] bg-center"
     style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}>
      {/* Golden Horizon Background with Top Glow */}
      
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 flex items-center space-x-2"
      >
        <img src="tablogo.png" alt="Logo" className="h-10  w-auto" />
        <img src="logo2nd1.png" alt="Logo" className="h-10 mt-1 w-auto" />
      </Link>

      <div className="relative z-10 flex items-center justify-between min-h-[calc(100vh-160px)] px-4 pb-12">
        {/* LEFT SIDE – anchored to the extreme left */}
        <div className="flex flex-col gap-6 w-full max-w-sm pl-16">
          {/* Top centered heading and paragraph */}
          <div className="relative z-10 pt-4 pb-6  mt-40 text-center px-1 max-w-7xl mx-auto">
            <h1 className="roboto text-6xl font-extrabold text-black mb-1 drop-shadow-lg">
              Contact Us
            </h1>
            <p className="text-sm text-black opacity-70 ml-4 text-left mt-3 max-w-3xl mx-auto drop-shadow-md">
              We're here to help! Please fill out the form to get in touch with
              our customer care team. Provide as much detail as possible, and
              feel free to upload any relevant images.
            </p>
          </div>
         
          <div className="bg-white/80 border-1 border-yellow-400 p-4 rounded-md text-white shadow">
            <div className="border w-10 height-12 flex items-center justify-center border-yellow-400 rounded-sm p-1">
              <div className="w-8 h-8  bg-yellow-500 rounded-sm flex items-center justify-center text-gray-800">
                <MdEmail />
              </div>
            </div>
            <h3 className="roboto text-yellow-500 font-semibold text-lg mb-2">
              Email Us
            </h3>
            <p className="roboto text-sm text-black">
              gofuture440@gmail.com
              <br />
              Mon–Fri, 9am to 6pm
            </p>
          </div>
        </div>
        <div className="w-full max-w-md mt-10 bg-white/80 border border-yellow-400 text-black p-4 md:mr-16 max-h-[600px] rounded-lg">
          <h2 className="roboto text-2xl font-semibold text-left mb-6 text-black">
            Send Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="roboto block text-sm font-medium text-black pb-2">
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
                    color: "black", // Input text
                    "&::placeholder": { color: "black" }, // Placeholder text
                  },
                }}
                InputLabelProps={{
                  sx: { color: "black" }, // Label color
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "gray", // Underline default
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "black", // Underline on hover
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "black", // Underline after
                  },
                }}
              />
            </div>

            <div>
              <label className="roboto block text-sm font-medium text-black pb-2">
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
                    color: "black", // Input text
                    "&::placeholder": { color: "black" }, // Placeholder text
                  },
                }}
                InputLabelProps={{
                  sx: { color: "black" }, // Label color
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "gray", // Underline default
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "black", // Underline on hover
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "black", // Underline after
                  },
                }}
              />
            </div>

            <div>
              <label className="roboto block text-sm font-medium text-black pb-2">
                Describe the Problem
              </label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none text-black h-20 "
              ></textarea>
            </div>

            <div>
              <label className="roboto block text-sm font-medium text-black pb-2">
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
                className="roboto flex items-center justify-center cursor-pointer w-full px-2 py-2 border-2 border-yellow-400 border-dashed rounded-md text-black hover:bg-yellow-50 hover:text-black transition-colors h-10"
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
                  className="bg-green-500 h-0.5 rounded-full transition-width duration-700 ease-in-out"
                  style={{ width: `${progress}%`, willChange: 'width' }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-yellow-500 text-black roboto font-bold py-2 rounded-md hover:bg-yellow-600 ${submitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
