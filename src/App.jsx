import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './component/DashboardLayout';
import Dashboard from './pages/Dashboard';
// import CreateStaff from './pages/CreateStaff';
import Login from './component/Login';
// import AddProcess from './pages/Processadd';
import AddPressLog from './pages/Processadd';
import TitleManager from './pages/TitleManager';
import ProcessList from './pages/ProcessList';
import AddPressman from './pages/Pressman';
import CreateUser from './pages/CreateUser';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <DashboardLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* <Route path="create-staff" element={<CreateStaff />} />
          <Route path="location-form" element={<LocationForm />} />
          <Route path="user-staff" element={<UserStaff />} />
          <Route path="labelprint" element={<LabelPrint />} />
          <Route path="location-form" element={<LocationForm/>}/> */}
          <Route path="process" element={<ProcessList/>} />
          <Route path="processadd" element={<AddPressLog/>} />
          <Route path="pressman" element={<AddPressman />} />
          <Route path="titlemanager" element={<TitleManager />} />
          <Route path="user" element={<CreateUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
