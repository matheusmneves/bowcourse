import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './routes/Home';
import Programs from './routes/Programs';
import Courses from './routes/Courses';
import Contact from './routes/Contact';
import Signup from './routes/Signup';
import Login from './routes/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Profile from './routes/Profile';
import MyCourses from './routes/My-courses';
import MyPrograms from './routes/My-programs';
import { CssVarsProvider } from '@mui/joy/styles';
import { joyTheme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdmAddCourses from './routes/Adm-add-courses';
import AdmAddPrograms from './routes/Adm-add-programs';
import AdmContact from './routes/Adm-contact';
import api from './api';
import { useEffect } from 'react';
import AdmStudentList from './routes/Adm-student-list';


function App() {
  useEffect(() => {
    api.get('/')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('DB connection error:', error);
      });
  }, []);
  return (
    <Router>
      <AuthProvider>
        <CssVarsProvider theme={joyTheme}>
          <div className="App min-h-screen bg-gray-100">
            <Header />
            <Routes>
              {/* Public route for home page */}
              <Route path="/" element={<Home />} />

              {/* Public route for programs */}
              <Route path="/programs" element={<Programs />} />

              {/* Public route for courses */}
              <Route path="/courses" element={<Courses />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Private routes: restrict access for students */}
              <Route
                path="/student-dashboard"
                element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>}
              />
              <Route
                path="/profile"
                element={<PrivateRoute role="student"><Profile /></PrivateRoute>}
              />
              <Route
                path="/my-courses"
                element={<PrivateRoute role="student"><MyCourses /></PrivateRoute>}
              />
              <Route
                path="/my-programs"
                element={<PrivateRoute role="student"><MyPrograms /></PrivateRoute>}
              />
              {/* Public route for contact */}
              <Route
                path="/contact"
                element={<PrivateRoute role="student"><Contact /></PrivateRoute>}
              />

              {/* Private routes: restrict access for admin */}
              <Route
                path="/admin-dashboard"
                element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>}
              />
              <Route
                path="/adm-add-courses"
                element={<PrivateRoute role="admin"><AdmAddCourses /></PrivateRoute>}
              />
              <Route
                path="/adm-add-programs"
                element={<PrivateRoute role="admin"><AdmAddPrograms /></PrivateRoute>}
              />
              <Route
                path="/adm-contact"
                element={<PrivateRoute role="admin"><AdmContact /></PrivateRoute>}
              />
              <Route
                path="/adm-student-list"
                element={<PrivateRoute role="admin"><AdmStudentList /></PrivateRoute>}
              />
            </Routes>
          </div>
        </CssVarsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;