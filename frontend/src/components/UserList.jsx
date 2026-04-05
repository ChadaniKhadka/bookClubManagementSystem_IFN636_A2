import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const UserList = ({ users, setusers, setEditingTask }) => {
  const { user } = useAuth();
  

  const handleDelete = async (userID) => {
    try {
      await axiosInstance.delete(`/api/users/${userID}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setusers(users.filter((user) => user._id !== userID));
    } catch (error) {
      alert('Failed to delete task.');
    }
  };

  return (
    <div className="table-section">
    {/* <div className="table-toolbar">
        <div>
        <div className="table-title">📖 Book Collection</div>
        <div className="table-count">{filtered.length} of {books.length} books</div>
        </div>
        <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
            placeholder="Search books…"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
        </div>
    </div> */}

    {users.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
            No Users found
          </div>
    ) : (
      
        <table className="w-full text-sm">
        <thead className="bg-gray-100 text-xs uppercase">
            <tr>
            <th className="p-4">#</th>
            <th className="p-4">User Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone Number</th>
            <th className="p-4">Address</th>

            </tr>
        </thead>
        <tbody>
            {users.map((user,key) => (
                <tr key={user.id} className="border-b hover:bg-blue-50">
                <td className="p-4 text-center" style={{ color: "#c9a84c", fontWeight: 700, fontFamily: "Playfair Display, serif" }}>
                    {key+1}
                </td>
                <td className="p-4 font-semibold text-center">
                    <div className="book-title">{user.name}</div>
                </td>
                <td className="p-4 text-center"><span className="genre-tag">{user.email}</span></td>
                <td className="p-4 text-center">
                   <div className="book-title">{user.phoneNumber}</div>
                </td>
                <td className="p-4 text-center">
                   <div className="book-title">{user.address}</div>
                </td>
                </tr>
            )
            )}
        </tbody>
        </table>
    )}
    </div>
  );
};

export default UserList;