import React from 'react'

import { message } from 'antd'


import { AiOutlineMenu } from 'react-icons/ai'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { PiStudent } from 'react-icons/pi'
import { MdSubject } from 'react-icons/md'
import { MdStickyNote2 } from 'react-icons/md'
import { BiLogOut } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'


import { signOut } from 'firebase/auth'

import { Link } from 'react-router-dom'
import { useAuthContext } from '../Context/AuthContext'
import { auth } from '../config/firebase'




export default function Sidebar() {

    const { dispatch } = useAuthContext()



    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                message.success("Signout successful")
                dispatch({ type: "SET_LOGGED_OUT" })
            })
            .catch(err => {
                message.error("Signout not successful")
            })
    }


    return (
        <>
            <div className="container py-3">
                <div className="row py-2">
                    <div className="py-2 px-0 bg-light rounded-3 ms-2">
                        <div className="row px-1">
                            <div className="col d-none d-md-block ms-2"> <h4>Menu</h4> </div>
                            {/* <div className="col text-start text-md-end"> <AiOutlineMenu size={20} /> </div> */}
                        </div>
                        <div className='d-flex justify-content-between flex-column' id='sidebar' style={{height:"78vh"}}>
                            <div className='ms-2'>
                                <h6 className='mt-3 px-2' >Task</h6>
                                <ul className="nav nav-pills flex-column px-1" >
                                    <li className="nav-item text-dark mb-3 ">
                                        <Link to="/" className="nav-link text-dark  text-decoration-none py-1">
                                            <MdOutlineKeyboardDoubleArrowRight size={18} />
                                            <span className='d-none d-sm-inline ms-2'>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item text-dark mb-3">
                                        <Link to="/students" className="nav-link text-dark  text-decoration-none py-1">
                                            <PiStudent size={18} />
                                            <span className='d-none d-sm-inline ms-2'>Students</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item text-dark   mb-3">
                                        <Link to='/courses' className="nav-link text-dark text-decoration-none py-1">
                                            <MdSubject size={18} />
                                            <span className='d-none d-sm-inline ms-2'>Course</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item text-dark mb-3">
                                        <Link to="/attendence" className="nav-link text-dark  text-decoration-none py-1">
                                            <MdStickyNote2 size={18} />
                                            <span className='d-none d-sm-inline ms-2'>Attendence</span>
                                        </Link>
                                    </li>
                                </ul>


                                <h6 className='mt-3 px-2' >Recently Deleted</h6>
                                <ul className="nav nav-pills flex-column px-1" >
                                    <li className="nav-item text-dark mb-3 ">
                                        <Link to="/deleted" className="nav-link text-dark  text-decoration-none py-1">
                                            <AiFillDelete size={18} className='text-danger' />
                                            <span className='d-none d-sm-inline ms-2'>Recycle Bin</span>
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                            <div>
                                <div className='row mb-3 px-2'>
                                    <div className="col-12 text-center">
                                        <button className='btn px-2 w-100' style={{ background: "#e9ecef" }} onClick={handleLogout}><Link to="/auth/login" className='text-decoration-none'>
                                            <BiLogOut size={20} />
                                            <span className='d-none d-sm-inline'>  Logout</span></Link></button>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
