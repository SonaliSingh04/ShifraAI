// import React, { useEffect, useState } from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import Home from './pages/Home'
// import Login from './pages/Login'
// import axios from 'axios'
// import Navbar from './Components/Navbar'
// import Builder from './pages/Builder'
// import Billing from './pages/Billing'
// import {Toaster} from "react-hot-toast"
// <<<<<<< HEAD
// import ProtectedRoute from "./components/ProtectedRoute";
// export const serverurl = "https://shifraaiserver-hez8.onrender.com"
// =======
// import ProtectedRoute from "./components/ProtectedRoute.js";
// export const serverurl = "http://localhost:8000"
// >>>>>>> 79904e8 (Fix ProtectedRoute import)
// export const CLIENT_URL = "http://localhost:5173"

// function App() {
//   const [user, setUser] = React.useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axios.get(serverurl + "/api/user/current-user", { withCredentials: true })
//         console.log(res.data)
//         setUser(res.data)
//         setLoading(false)
//       } catch (error) {
//         console.log(error)
//         setLoading(false)

//       }
//     }
//     fetchMe()
//   }, [])
//   return (
//    <>
//     <Toaster position='top-right'/>
//     <Routes>

//       <Route path="/login" element={<Login setUser={setUser}/>} />
//       <Route path='/*' element={<ProtectedRoute user={user} loading={loading}>
//         <Navbar setUser={setUser} user={user}/>
//         <Routes>
//           <Route path='/' element={<Home user = {user} />} />
//           <Route path='/builder' element={<Builder user = {user} setUser={setUser}/>}/>
//           <Route path='/billing' element={<Billing user = {user} setUser={setUser}/>}/>
//           <Route path='*' element={<Navigate to ="/"replace/>}/>
//         </Routes>
        

//       </ProtectedRoute>} />
//     </Routes>
//     </>
//   )
// }

// export default App


import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import axios from 'axios'
import Navbar from './Components/Navbar'
import Builder from './pages/Builder'
import Billing from './pages/Billing'
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

export const serverurl = "https://shifraaiserver-hez8.onrender.com"
export const CLIENT_URL = "http://localhost:5173"

function App() {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          serverurl + "/api/user/current-user",
          { withCredentials: true }
        )
        console.log(res.data)
        setUser(res.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetchMe()
  }, [])

  return (
    <>
      <Toaster position='top-right' />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route
          path='/*'
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Navbar setUser={setUser} user={user} />
              <Routes>
                <Route path='/' element={<Home user={user} />} />
                <Route path='/builder' element={<Builder user={user} setUser={setUser} />} />
                <Route path='/billing' element={<Billing user={user} setUser={setUser} />} />
                <Route path='*' element={<Navigate to="/" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
