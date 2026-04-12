import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../img/logo.png'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
    <style>
      {`
       .nav-bar {
          background: #F8F9FA;
          color: #f7f4ef;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
        }
        .login{

        }
      `}
    </style>
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center nav-bar">
      <img src={logo} alt="Club_logo" width="150" height="50" />
      <div>
        {user ? (
          <>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 bg-blue-500 px-4 py-2 rounded hover:bg-green-700">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
