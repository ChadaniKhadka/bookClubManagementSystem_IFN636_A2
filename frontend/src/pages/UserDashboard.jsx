import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Library,
  LayoutDashboard,
  Menu,
  X,
  CheckCircle
} from "lucide-react";
import Profile from './Profile';
import Book from './Book';
import Club from './Club';


export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "profile", label: "Profile", icon: Users },
    { key: "clubs", label: "Club Management", icon: Library },
    { key: "books", label: "Book Management", icon: BookOpen },
  ];
  const isAdmin = JSON.parse(localStorage.getItem("user")).isAdmin;

useEffect(() => {
     if(isAdmin){
      navigate('/not-found');
    }
  const fetchStats = async () => {
    const res = await axiosInstance.get("/api/dashboard/stats");
    setStats(res.data);
  };

  fetchStats();
}, [isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-xl h-screen fixed md:relative z-50 transition-all duration-300
        ${isOpen ? "left-0" : "-left-64"} md:left-0 w-64`}
      >
        <div className="p-4 text-xl font-bold border-b flex justify-between items-center">
          User Panel
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-3 space-y-2">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition
              ${activeTab === item.key ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">
        {/* Topbar */}
        <div className="bg-white shadow flex items-center justify-between p-4">
          <button className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu />
          </button>

          <h1 className="text-xl font-bold capitalize">
            {activeTab}
          </h1>

          <div className="text-sm text-gray-500">Admin</div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
           <div>
  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
    Overview
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* BOOKS */}
    <div className="bg-yellow-50 border border-yellow-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total Books</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {stats?.totalBooks || 0}
          </h3>
        </div>
        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
          <BookOpen size={22} />
        </div>
      </div>
    </div>

    {/* CLUBS */}
    <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total Clubs</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {stats?.totalClubs || 0}
          </h3>
        </div>
        <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
          <Library size={22} />
        </div>
      </div>
    </div>

    {/* ACTIVE CLUBS */}
    <div className="bg-green-50 border border-green-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Active Clubs</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {stats?.activeClubs || 0}
          </h3>
        </div>
        <div className="bg-green-100 text-green-600 p-3 rounded-full">
          <CheckCircle size={22} />
        </div>
      </div>
    </div>

  </div>
  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* RECENT BOOKS */}
  <div className="bg-white p-5 rounded-2xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Recent Books
    </h3>

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Author</th>
            <th className="py-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {stats?.recentBooks?.length > 0 ? (
            stats.recentBooks.map((book) => (
              <tr key={book._id} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium text-gray-700">
                  {book.name}
                </td>
                <td className="py-2 text-gray-600">
                  {book.author}
                </td>
                <td className="py-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
                    {book.category}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-400">
                No recent books
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* RECENT CLUBS */}
  <div className="bg-white p-5 rounded-2xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Recent Clubs
    </h3>

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Status</th>
            <th className="py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {stats?.recentClubs?.length > 0 ? (
            stats.recentClubs.map((club) => (
              <tr key={club._id} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium text-gray-700">
                  {club.name}
                </td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      club.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {club.status}
                  </span>
                </td>
                <td className="py-2 text-gray-600 truncate max-w-[150px]">
                  {club.description}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-400">
                No recent clubs
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

</div>
</div>
          )}

          {activeTab === "profile" && <Profile isAdmin={isAdmin}/>}
          {activeTab === "books" && <Book isAdmin={isAdmin}/>}
          {activeTab === "clubs" && <Club isAdmin={isAdmin}/>}
        </div>
      </div>
    </div>
  );
}
