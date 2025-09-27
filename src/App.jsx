import './index.css';
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './components/privroute';
import Layout from './components/layout';
import AuthPage from './pages/authPage';
import VerificationPage from './pages/verificationPage';
//Learner
import LearnerDashboard from './pages/learner/learner_dashboard';
//Teacher
import TeacherDashboard from './pages/teacher/teacher_dashboard';
import ClassMasterlist from './pages/teacher/class_masterlist';
import TeacherLearningMaterials from './pages/teacher/teachers_resources';
import InterventionSchedule from './pages/teacher/intervention_schedule';
//Admin
import AdminDashboard from './pages/admin/admin_dashboard';
import LearningMaterials from './pages/admin/resources';
//Manage Users in Admin
import ManageUsers from './pages/admin/user_management';
import Learners from './pages/admin/users/learners';
import Teachers from './pages/admin/users/teachers';
import SectionDetails from './pages/admin/users/section_details';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    console.log("App - Route changed to:", location.pathname);
  }, [location]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/authpage" element={<AuthPage />} />
        <Route path="/verification-page" element={<VerificationPage />} />
        
        <Route element={<Layout />}>
        {/*Learner Routes*/}
          <Route
            path="/learner-dashboard"
            element={
              <PrivateRoute allowedRoles={['learner']}>
                <LearnerDashboard />
              </PrivateRoute>
            }
          />


          {/*Teacher Routes*/}
          <Route
            path="/teacher-dashboard"
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/class-masterlist"
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <ClassMasterlist />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher-materials"
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <TeacherLearningMaterials />
              </PrivateRoute>
            }
          />
          <Route
            path="/intervention-schedule"
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <InterventionSchedule />
              </PrivateRoute>
            }
          />


          {/*Admin Routes*/}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <ManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-resources"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <LearningMaterials />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-users/learners"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Learners />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-users/teachers"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Teachers />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-users/learners/section-details/:sectionName"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <SectionDetails />
              </PrivateRoute>
            }
          />
        </Route>
        
      </Routes>
    </>
  );
}

export default App;