import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/404';

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route
            path="/login"
            element={
                <Login />
            }
          />

          <Route
            path="/register"
            element={
                <Register />
            }
          />

          <Route
            path="/admin-register"
            element={
                <AdminRegister />
            }
          />
          <Route
            path="/profile"
            element={
                <Profile />
            }
          />

          <Route
            path="/tasks"
            element={
                <Tasks />
            }
          />

          <Route
            path="/admin-dashboard"
            element={
                <AdminDashboard />
            }
          />

          <Route
            path="/user-dashboard"
            element={
                <UserDashboard />
            }
          />
           <Route
            path="/not-found"
            element={
                <NotFound />
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;