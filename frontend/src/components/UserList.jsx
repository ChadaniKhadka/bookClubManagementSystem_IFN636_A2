const UserList = ({ users, setusers, setEditingTask }) => {

  return (
    <div className="table-section">

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