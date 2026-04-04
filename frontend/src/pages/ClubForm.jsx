import { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const CreateClub = () => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    description: '',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Only ONE image allowed
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // only first file
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file)); // preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('status', formData.status);
      data.append('description', formData.description);
      data.append('coverImage', coverImage); // single image

      await axiosInstance.post('/api/clubs', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Club created successfully!');
      navigate('/clubs');
    } catch (error) {
      console.error(error);
      alert('Failed to create club.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create Club
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Club Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter club name"
              className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter club description"
              rows="4"
              className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Cover Image (Single) */}
          <div>
            <label className="text-sm text-gray-600">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 p-2 border rounded-xl bg-white"
              required
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-full h-40 object-cover rounded-xl border"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
          >
            Create Club
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClub;