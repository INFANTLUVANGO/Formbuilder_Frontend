import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import AdminHome from './Components/Admin/AdminHome'
import CreateForm from './Components/Admin/Create/CreateForm'
import AssignLearner from './Components/Admin/AssignLearner'
import ViewForm from './Components/Admin/ViewForm'
import ViewResponses from "./Components/Admin/ViewResponses";
import Preview from "./Components/Admin/Create/Preview";
import './Styles/All.sass'

export default function FormBuilder() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/create/:formId?" element={<CreateForm />} />
          <Route path="/assign-learner" element={<AssignLearner />} />
          <Route path="/view-form" element={<ViewForm />} />
          <Route path="/view-responses" element={<ViewResponses/>} />
          <Route path="/preview/:formId" element={<Preview />} />

        </Routes>
      </Layout>
    </Router>
  )
}


// import ProtectedRoute from './Components/Routes/ProtectedRoute';
// import LearnerHome from './Components/Learner/LearnerHome';

// export default function FormBuilder() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           {/* Admin routes */}
//           <Route path="/" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <AdminHome />
//             </ProtectedRoute>
//           }/>
//           <Route path="/create" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <CreateForm />
//             </ProtectedRoute>
//           }/>
//           <Route path="/assign-learner" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <AssignLearner />
//             </ProtectedRoute>
//           }/>
//           <Route path="/view-form" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <ViewForm />
//             </ProtectedRoute>
//           }/>
//           <Route path="/view-responses" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <ViewResponses />
//             </ProtectedRoute>
//           }/>

//           {/* Learner route */}
//           <Route path="/learner-home" element={
//             <ProtectedRoute allowedRoles={['learner']}>
//               <LearnerHome />
//             </ProtectedRoute>
//           }/>
//         </Routes>
//       </Layout>
//     </Router>
//   )
// }
