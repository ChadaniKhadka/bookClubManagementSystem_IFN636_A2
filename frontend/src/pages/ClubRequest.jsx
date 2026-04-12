import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Check, X } from "lucide-react";

const ClubRequest = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchRequests = async () => {
    try {
          const res = await axiosInstance.get(`/api/clubs/membership/pending-request`);
          setRequests(res.data);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchRequests();
  }, []);
  const acceptRequest = async (club) => {
  try {
    const res = await axiosInstance.post(`/api/clubs/accept-request/${club}`);
   fetchRequests();
  } catch (err) {
    console.error(err.response?.data);
  }
};
  const rejectRequest = async (club) => {
  try {
    const res = await axiosInstance.post(`/api/clubs/leaveOrRejectClub/${club.clubId._id}/${club.userId._id}`);
   fetchRequests();
  } catch (err) {
    console.error(err.response?.data);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Club Request Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage, track and organize your request
          </p>
        </div>

      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border">

        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No request found
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-4">Club Name</th>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) =>(
                    
                  <tr
                    key={request._id}
                    className="border-b hover:bg-blue-50 transition"
                  >

                    <td className="p-4 font-semibold text-gray-800">
                      {request.clubId.name}
                    </td>

                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {request.userId.name}
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                          : "bg-gray-200 text-gray-600"
                      `}>
                        Pending
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">

                          <button
                            onClick={() => acceptRequest(request._id)}
                            className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition"
                          >
                            <Check size={16} /> <span>Accept</span> 
                          </button>
                        <button 
                        onClick={() => rejectRequest(request)}
                        className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition">
                          <X size={16} /> <span>Reject</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

    </div>
  );
};

export default ClubRequest;