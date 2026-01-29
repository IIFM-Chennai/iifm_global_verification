import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import Login from './pages/Login'
import AddCandidate from './pages/AddCandidate'
import ManageCandidate from './pages/ManageCandidate'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import SearchCandidate from './pages/SearchCandidate';
import CandidateDetails from './pages/CandidateDetails';
import Footer from './components/Footer';



function App() {

  return (
    <div className="app-container">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
        toastStyle={{
          width: "30%", // Default width for larger screens
          minWidth: "250px",
          marginTop: "70px", // Pushes below the navbar
        }}
        bodyClassName="custom-toast-body"
      />
         <div className="content"> {/* This keeps the content stretched */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/manage-candidate" element={<ManageCandidate />} />
            <Route path="/dashboard/add-candidate" element={<AddCandidate />} />
            <Route path="/dashboard/search-candidate" element={<SearchCandidate />} />
            <Route path="/dashboard/candidate/:candidateId" element={<CandidateDetails />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </div>

      <Footer />
    </div>

  )
}

export default App
