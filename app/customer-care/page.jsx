"use client";
import { useState } from 'react';

export default function CustomerCarePage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('description', description);
    images.forEach((img) => formData.append('images', img));

    try {
      const res = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Your issue has been submitted.');
        setEmail('');
        setSubject('');
        setDescription('');
        setImages([]);
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('/contact-back.jpg')]">
      <div className="absolute inset-0 bg-black/60 bg-opacity-60 z-0"></div>

      {/* Top centered heading and paragraph */}
      <div className="relative z-10 pt-4 pb-6 text-center px-1 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-yellow-400 mb-1 drop-shadow-lg">Contact Us</h1>
        <p className="text-sm text-white max-w-3xl mx-auto drop-shadow-md">
          We're here to help! Please fill out the form to get in touch with our customer care team. Provide as much detail as possible, and feel free to upload any relevant images.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-end min-h-[calc(100vh-160px)] px-4 pb-12">
        <div className="w-full max-w-lg bg-gray-900 bg-opacity-90 backdrop-blur-md p-6 rounded shadow-md md:mr-16">
          <h2 className="text-2xl font-semibold text-left mb-6 text-yellow-500">Send Message</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white pb-2">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white pb-2">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white pb-2">Describe the Problem</label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-md resize-none text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-white pb-2">Upload Images (Optional)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-white"
              />
              {images.length > 0 && (
                <p className="text-sm text-green-600 mt-1">{images.length} image(s) selected</p>
              )}
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
