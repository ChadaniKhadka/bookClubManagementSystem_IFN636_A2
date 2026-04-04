import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
// import Dashboard from './pages/Dashboard';
import User from './pages/User';
// import ClubForm from './pages/ClubForm'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
         {/* <Route path="/dashboard" element={<Dashboard />} /> */}
         <Route path="/users" element={<User />} />
          {/* <Route path="/club-form" element={<ClubForm />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
