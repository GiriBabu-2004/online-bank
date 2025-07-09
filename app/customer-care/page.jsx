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
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      <div className="relative z-10 flex items-center justify-end min-h-screen px-4">
        <div className="w-full max-w-2xl bg-white bg-opacity-90 backdrop-blur-md p-8 rounded shadow-md md:mr-16">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Customer Care Support</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Registered Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Describe the Problem</label>
              <textarea rows="4" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-md resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Images (Optional)</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full" />
              {images.length > 0 && <p className="text-sm text-green-600 mt-1">{images.length} image(s) selected</p>}
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
