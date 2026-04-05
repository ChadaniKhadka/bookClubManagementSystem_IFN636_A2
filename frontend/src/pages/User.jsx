import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import UserList from '../components/UserList';

const Users = (isAdmin) => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
           const response = await axiosInstance.get('/api/auth/users', {
              headers: { Authorization: `Bearer ${user.token}` },
            });

        console.log('Users fetched:', response.data);
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Loading UI
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading users...</p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="container mx-auto p-6">
      <UserList users={users} setUsers={setUsers} />
    </div>
  );
};

export default Users;