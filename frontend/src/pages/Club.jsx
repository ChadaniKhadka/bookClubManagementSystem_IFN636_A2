import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Check, FileQuestion, Pencil, Trash2, X } from "lucide-react";

const Club = (isAdmin) => {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
    description: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      if(isAdmin.isAdmin){
          const res = await axiosInstance.get("/api/clubs");
          setClubs(res.data);
      }
      else{
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await axiosInstance.get(`/api/clubs/member/${user.id}`);
          setClubs(res.data);
      }
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const openModal = (club = null) => {
    setEditingClub(club);
    setIsOpen(true);

    if (club) {
      setFormData({
        name: club.name,
        status: club.status,
        description: club.description,
      });
      setPreview(`http://localhost:5001${club.coverImage}`);
    } else {
      setFormData({ name: "", status: "active", description: "" });
      setPreview(null);
      setCoverImage(null);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingClub(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("status", formData.status);
    data.append("description", formData.description);

    if (coverImage instanceof File) {
      data.append("coverImage", coverImage);
    }

    try {
      if (editingClub) {
        await axiosInstance.put(`/api/clubs/${editingClub._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/api/clubs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchClubs();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this club?")) return;
    await axiosInstance.delete(`/api/clubs/${id}`);
    fetchClubs();
  };
   const rejectRequest = async (club) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
     await axiosInstance.post(`/api/clubs/leaveOrRejectClub/${club._id}/${user.id}`);
   fetchClubs();
  } catch (err) {
    console.error(err.response?.data);
  }
};

  // FILTER
  const filteredClubs = clubs.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoin = async (club) => {
  try {
    const res = await axiosInstance.post(`/api/clubs/join/${club._id}/${club.userId}`);
   fetchClubs();
  } catch (err) {
    console.error(err.response?.data);
  }
};

  const total = clubs.length;
  const active = clubs.filter((c) => c.status === "active").length;
  const inactive = total - active;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Club Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage, track and organize your clubs
          </p>
        </div>
        {isAdmin.isAdmin && (
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition"
        >
          + Create Club
        </button>
        )}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-500">Total Clubs</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-green-50 rounded-2xl shadow p-4">
          <p className="text-gray-500">Active</p>
          <h2 className="text-2xl font-bold text-green-600">{active}</h2>
        </div>

        <div className="bg-gray-50 rounded-2xl shadow p-4">
          <p className="text-gray-500">Inactive</p>
          <h2 className="text-2xl font-bold text-gray-600">{inactive}</h2>
        </div>

      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-xl border bg-white shadow focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <span className="absolute left-3 top-3 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border">

        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No clubs found
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredClubs.map((club) => (
                  <tr
                    key={club._id}
                    className="border-b hover:bg-blue-50 transition"
                  >

                    <td className="p-4">
                      <img
                        src={`http://localhost:5001${club.coverImage}`}
                        className="w-12 h-12 rounded-lg object-cover shadow"
                        alt={club.id}
                      />
                    </td>

                    <td className="p-4 font-semibold text-gray-800">
                      {club.name}
                    </td>

                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {club.description}
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        club.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {club.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                     {isAdmin.isAdmin ? (
                        <>
                          <button
                            onClick={() => openModal(club)}
                            className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil size={16} className="text-yellow-600" />
                          </button>

                          <button
                            onClick={() => handleDelete(club._id)}
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </>
                      ) : club.memberStatus === null ? (
                        // Not a member — show Join button
                        <button onClick = {()=>handleJoin(club)} className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition">
                          <Check size={16} /> <span>Join Club</span>
                        </button>
                      ) : club.memberStatus === "pending" ? (
                        // Pending approval
                        <button disabled className="inline-flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded transition cursor-not-allowed">
                          <FileQuestion size={16} /> <span>Approval Pending</span>
                        </button>
                      ) : (
                        // Already a member — show Leave button
                        <button onClick = {()=>rejectRequest(club)} className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition">
                          <X size={16} /> <span>Leave Club</span>
                        </button>
                      )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

      {/* MODAL (same as yours, no change needed) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingClub ? "Edit Club" : "Add Club"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Club Name"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Description"
              />

              <input type="file" onChange={handleFileChange} />

              {preview && (
                <img
                  src={preview}
                  className="h-32 w-full object-cover rounded mt-2"
                  alt=""
                />
              )}

              <div className="flex gap-2 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded">
                  {editingClub ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 py-2 rounded"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Club;