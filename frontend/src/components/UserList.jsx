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
    <>
    <style>{`
    /* TABLE SECTION */
        .table-section { background: #fff; border-radius: 16px; box-shadow: 0 2px 20px rgba(0,0,0,0.07); border: 1px solid #ede8e1; overflow: hidden; }

        .table-toolbar {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f0ebe4;
        }
        .table-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
        }
        .table-count { font-size: 13px; color: #9e9187; margin-top: 2px; }

        .search-box {
          position: relative;
        }
        .search-box input {
          padding-left: 36px;
          width: 220px;
        }
        .search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9e9187;
          font-size: 15px;
        }

        table { width: 100%; border-collapse: collapse; }
        thead {
          background: #f7f4ef;
        }
        th {
          padding: 12px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #9e9187;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        td {
          padding: 14px 20px;
          border-top: 1px solid #f0ebe4;
          font-size: 14px;
          vertical-align: middle;
        }
        tr { transition: background 0.15s; }
        tr:hover td { background: #faf9f7; }

        .book-title { font-weight: 600; color: #1a1714; }
        .book-author { font-size: 12px; color: #9e9187; margin-top: 2px; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; }

        .genre-tag {
          background: #f0ebe4;
          color: #6b5e52;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .actions { display: flex; gap: 8px; }
        .btn-edit {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1.5px solid #c9a84c;
          background: transparent;
          color: #92400e;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 5px;
        }
        .btn-edit:hover { background: #c9a84c; color: #fff; }
        .btn-delete {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1.5px solid #fca5a5;
          background: transparent;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 5px;
        }
        .btn-delete:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9e9187;
        }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-text { font-size: 15px; font-weight: 500; }
    `}
    </style>
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
        <div className="empty-state">
        <div className="empty-icon">📭</div>
        <div className="empty-text">No users found</div>
        </div>
    ) : (
        <table>
        <thead>
            <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>

            </tr>
        </thead>
        <tbody>
            {users.map((user,key) => (
                <tr key={user.id}>
                <td style={{ color: "#c9a84c", fontWeight: 700, fontFamily: "Playfair Display, serif" }}>
                    {key+1}
                </td>
                <td>
                    <div className="book-title">{user.name}</div>
                </td>
                <td><span className="genre-tag">{user.email}</span></td>
                <td>
                   <div className="book-title">{user.phoneNumber}</div>
                </td>
                <td>
                   <div className="book-title">{user.address}</div>
                </td>
                </tr>
            )
            )}
        </tbody>
        </table>
    )}
    </div>
    </>
  );
};

export default UserList;