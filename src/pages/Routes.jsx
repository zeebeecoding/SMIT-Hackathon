import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Auth from "./Auth"
import { useAuthContext } from '../Context/AuthContext'
import PrivateRoute from '../Components/PrivateRoute'
import Dashboard from "./Dashboard"


export default function Index() {
  const { isAuth } = useAuthContext()
  return (
    <>
      <Routes>
        <Route path='/*' element={<PrivateRoute Component={Dashboard} />} />
        <Route path='/auth/*' element={!isAuth ? <Auth /> : <Navigate to="/" />} />
        {/* <Route path='/dashboard/*' element={<PrivateRoute Component={Dashboard} />} /> */}
      </Routes>
    </>
  )
}
