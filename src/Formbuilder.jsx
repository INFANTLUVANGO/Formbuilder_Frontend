import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout/Layout' // Shared Layout
import AdminHome from './Components/Admin/AdminHome'
import CreateForm from './Components/Admin/Create/CreateForm'
import Preview from "./Components/Admin/Create/Preview";
import './Styles/All.sass'

// Placeholder components for the Learner View (Assumed imports)
import LearnerHome from './Components/Learner/LearnerHome' 



export default function FormBuilder() {
 return (
  <Router>
   <Layout>
    <Routes>

     {/* ======================================= */}
     {/* ADMIN/CREATOR ROUTES (Root Path /)  */}
     {/* The login process will navigate admins to this path: '/' */}
     {/* ======================================= */}

     <Route path="/" element={<AdminHome />} />
     <Route path="/create/:formId?" element={<CreateForm />} /> 
     <Route path="/view-form/:formId" element={<CreateForm />} />
     <Route path="/view-responses/:formId" element={<CreateForm />} />
     <Route path="/preview/:formId" element={<Preview />} />
     <Route path="/form/:formId/view-response/:responseId" element={<Preview />} />

     {/* ======================================= */}
     {/* LEARNER/USER ROUTES (Prefix /learner)  */}
     {/* The login process will navigate learners to this path: '/learner' */}
     {/* ======================================= */}
          
     <Route path="/learner" element={<LearnerHome />} /> 
     <Route path="/learner/submit/:formId" element={<Preview />} />
     

    </Routes>
   </Layout>
  </Router>
 )
}




// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Layout from './Components/Layout/Layout' // Shared Layout
// import AdminHome from './Components/Admin/AdminHome'
// import CreateForm from './Components/Admin/Create/CreateForm'
// import Preview from "./Components/Admin/Create/Preview";
// import './Styles/All.sass'

// // Placeholder components for the Learner View (Assumed imports)
// import LearnerHome from './Components/Learner/LearnerHome' 
// import SubmissionPage from './Components/Learner/SubmissionPage'
// import MyResponses from './Components/Learner/MyResponses' 


// export default function FormBuilder() {
//  return (
//   <Router>
//    <Layout>
//     <Routes>

//      {/* ======================================= */}
//      {/* ADMIN/CREATOR ROUTES (Root Path /)  */}
//      {/* The login process will navigate admins to this path: '/' */}
//      {/* ======================================= */}

//      <Route path="/" element={<AdminHome />} />
//      <Route path="/create/:formId?" element={<CreateForm />} /> 
//      <Route path="/view-form/:formId" element={<CreateForm />} />
//      <Route path="/view-responses/:formId" element={<CreateForm />} />
//      <Route path="/preview/:formId" element={<Preview />} />
//      <Route path="/form/:formId/view-response/:responseId" element={<Preview />} />

//      {/* ======================================= */}
//      {/* LEARNER/USER ROUTES (Prefix /learner)  */}
//      {/* The login process will navigate learners to this path: '/learner' */}
//      {/* ======================================= */}
          
//      <Route path="/learner" element={<LearnerHome />} /> 
//      <Route path="/learner/submit/:formId" element={<SubmissionPage />} />
//      <Route path="/learner/my-responses" element={<MyResponses />} />
//           <Route path="/learner/my-responses/:responseId" element={<SubmissionPage viewOnly={true} />} />

//     </Routes>
//    </Layout>
//   </Router>
//  )
// }



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
