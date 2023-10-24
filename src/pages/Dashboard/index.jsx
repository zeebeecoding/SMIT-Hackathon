import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar'
import Home from './Home'
import Students from './Students'
import Courses from './Courses'
import Attendence from './Attendence'

export default function Index() {
  return (
    <>
    <div className="container-fluid p-3 p-md-5 vh-100" style={{ background: '#bde0fe' }}>
        <div className="row bg-white rounded-4" id='abc' style={{height:"90vh"}}>
            <div className="col-4 col-md-2"> <Sidebar /> </div>
            <div className="col pe-2  my-4 overflow-scroll abc" style={{height:"84vh"}}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='students' element={<Students />} />
                    <Route path='courses' element={<Courses />} />
                    <Route path='attendence' element={<Attendence />} />
                    {/* <Route path='deleted' element={<Deleted />} /> */}
                    {/* <Route path='list/:id' element={<ListedTodo />} /> */}
                    <Route path="*" element={<h1>404</h1>} />
                </Routes>

            </div>
        </div>
    </div>
</>
  )
}
    