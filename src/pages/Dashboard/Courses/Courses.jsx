import React, { useState } from 'react'

import { message } from 'antd';

import { firestore } from '../../../config/firebase';
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { useAuthContext } from '../../../Context/AuthContext'
import { useFetchCourses } from '../../../Context/FetchCourses';

import { BsFillPencilFill } from "react-icons/bs";
import { AiTwotoneDelete } from "react-icons/ai";



const initialState = { courseCode: "", courseName: "", courseDescription: "" }

export default function Courses() {

  const [state, setState] = useState(initialState)
  const [getSearch, setGetSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuthContext()
  const { getCourse, setGetCourse } = useFetchCourses()

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }




  // search = Number(search)

  let searchedCustomers = [];
  if (getSearch === "") {
    searchedCustomers = getCourse
  }
  else {

    searchedCustomers = getCourse.filter((course) => course.courseName.toLowerCase().includes(getSearch.toLowerCase()))
  }
  const sortedCourses = [...searchedCustomers].sort((a, b) => a.courseCode - (b.courseCode));


  const handleSubmit = async (e) => {
    e.preventDefault();

    let { courseCode, courseName, courseDescription } = state

    courseName = courseName.trim()
    courseDescription = courseDescription.trim()

    if (!courseCode) {
      return message.error("Please enter your course code")
    }
    if (courseName.length < 3) {
      return message.error("Please enter proper name of course")
    }
    if (courseDescription.length < 8) {
      return message.error("Course description lenght is to short")
    }

    const data = {
      courseCode,
      courseName,
      courseDescription,
      id: Math.random().toString(36).slice(2),
      dateCreated: serverTimestamp(),
      status: "active",
      createdBy: {
        fullName: user.fullName,
        email: user.email,
        id: user.uid
      },
    }

    try {
      await setDoc(doc(firestore, "course", data.id), data
      );
      message.success("Course Added Successfully")
      setState(initialState)
      getCourse.push(data)
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong on Adding New Course")
    }
  }

  // ****Start****//

  const handleUpdate = async (course) => {
    setState(course)
    setIsProcessing(true)
  }

  const afterUpdate = async (e) => {

    const updateData = {
      ...state
    }



    const updateCourse = getCourse.map(oldCousre => {
      if (oldCousre.id === updateData.id)
        return updateData
      return oldCousre
    })
    setGetCourse(updateCourse)
    try {
      await updateDoc(doc(firestore, "course", updateData.id), updateData);

      message.success("Course Updated Successfully")
      setState(initialState)
      setIsProcessing(false)

    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong While Updating Course")
    }

  }
  // *******End*******//




  const handleDelete = async (course) => {
    try {
      await deleteDoc(doc(firestore, "course", course.id));

      let courseAfterDelete = getCourse.filter(doc => doc.id !== course.id)
      setGetCourse(courseAfterDelete)
      message.success("Course Deleted Successfully");

    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong While Deleting course")
    }
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row">
              <h2>Courses</h2>
            </div>
            <div className="row bg-light rounded-3">
              <div className="col">
              <div className="row ">
                <div className="col py-2 d-flex align-items-center"> <h5 className='mb-0'>Courses Table</h5> </div>
                <div className="col py-2"> <input type="text" className='form-control' placeholder='Search Any...' onChange={(e) => { setGetSearch(e.target.value) }} /></div>
                <div className="col py-2 text-end"> <button className='btn' data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ background: '#fbdfee' }}>Add</button></div>
              </div>
              <hr />
              <div className="row mx-0 mb-2">
                <div className="col bg-white rounded-3">

                  <div className="table-responsive rounded">
                    <table className="table">
                      <thead>
                        <tr className='' style={{ background: "#c1e6c3", color: "#005a16" }}>
                          <th >Sr.No</th>
                          <th >Course Code</th>
                          <th >Course Name</th>
                          <th >Course Description</th>
                          <th className='text-center'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          sortedCourses.map((course, i) => {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{course.courseCode}</td>
                                <td>{course.courseName}</td>
                                <td>{course.courseDescription}</td>
                                <td className='text-center'>
                                  <button className='btn btn-info p-1 py-0 rounded-2 me-0 me-lg-1' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { handleUpdate(course) }}> <span className='text-white my-1 d-flex align-items-center'><BsFillPencilFill size={16} /></span> </button>
                                  <button className='btn btn-danger p-1 py-0 rounded-2' onClick={() => { handleDelete(course) }}> <span className='text-white my-1 d-flex align-items-center'><AiTwotoneDelete size={16} /></span> </button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* model to add new students */}

      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title fs-5" id="exampleModalLabel">Add New Course</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row mb-2">
                  <div className="col-4">
                    {/* <label htmlFor="">Student ID:</label> */}
                    <input type="number" name="courseCode" placeholder='Course Code' value={state.courseCode} className='form-control' onChange={handleChange} />
                  </div>
                  <div className="col">
                    {/* <label htmlFor="">Student Name:</label> */}
                    <input type="text" name="courseName" placeholder='Course Name' value={state.courseName} className='form-control' onChange={handleChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {/* <label htmlFor="">Student Address:</label> */}
                    <textarea name="courseDescription" className='form-control' id="" value={state.courseDescription} placeholder='Course Description' cols="30" rows="3" onChange={handleChange}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {
                  isProcessing ?
                    <button className="btn" type='button' style={{ background: "#a2d2ff" }} data-bs-dismiss="modal" aria-label="Close" onClick={afterUpdate}>Update</button>
                    :
                    <button className="btn" type='button' style={{ background: "#a2d2ff" }} data-bs-dismiss="modal" aria-label="Close" onClick={handleSubmit}>Add</button>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
