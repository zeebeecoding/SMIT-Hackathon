import React, { useState } from 'react'
import { useFetchStudents } from '../../../Context/FetchStudents'
import { useFetchCourses } from '../../../Context/FetchCourses'
import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '../../../config/firebase'
import { message } from 'antd'
import { useFetchAttendence } from '../../../Context/FetchAttendence'

export default function Attendence() {


  const [state, setState] = useState("") 
  const { getStudents } = useFetchStudents()
  const { getCourse } = useFetchCourses()
  const { getAttendence } = useFetchAttendence()
  console.log('getAttendence', getAttendence)

  const getCourseId = getCourse.find(course => course.courseName === state)

  let showStudents = []

  if (getCourseId) {

    const filterstudents = getStudents.filter((student) => student.courseId === getCourseId.id)
    showStudents = filterstudents

  }

  const handlePresent = async (student) => {

    const data = student
    data.date = new Date().toLocaleDateString();
    data.attendence = "present"


    try {
      await setDoc(doc(firestore, "attendence", data.id), data
      );
      message.success("Successfully Done")
      getAttendence.push(data)
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong while taking Attendence")
    }
  }

  const handleAbsent = async(student) => {
    const data = student
    data.date = new Date().toLocaleDateString();
    data.attendence = "absent"


    try {
      await setDoc(doc(firestore, "attendence", data.id), data
      );
      message.success("Successfully Done")
      getAttendence.push(data)
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong while taking Attendence")
    }
  }
  const tableRows = showStudents.map((student, i) => {
    const account = getAttendence.find((attendence) => attendence.id === student.id);
    console.log('account', account)
    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{student.studentName}</td>
        <td>{student.courseName}</td>
        
        <td className='text-center'>
        
        <button className={`btn btn-info p-1 py-0 rounded-2 me-0 me-md-1 ${account && account.attendence === "present"? "disabled" : ""}`} onClick={() => { handlePresent(student) }}> <span className='text-white my-1 d-flex align-items-center'>Present</span> </button>
        
        <button className={`btn btn-danger p-1 py-0 rounded-2 ${account && account.attendence === "absent"? "disabled" : ""}`} onClick={() => { handleAbsent(student) }}> <span className='text-white my-1 d-flex align-items-center'>Absent</span> </button>
        
        </td>
      </tr>
    );
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Attendence</h2>
          </div>
          <div className="row">
            <div className="col-6">
              <select className='form-control' name='courseName' onChange={(e) => { setState(e.target.value) }}>
                <option value="">Select Any Course</option>
                {

                  getCourse.map((course, i) => {
                    return (
                      <option key={i}>{course.courseName}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          <hr />
          <div className="row mx-0 mb-2">
            <div className="col bg-white rounded-3">

              <div className="table-responsive rounded">
                <table className="table">
                  <thead>
                    <tr className='' style={{ background: "#c1e6c3", color: "#005a16" }}>
                      <th >Sr.No</th>
                      <th >Student Name</th>
                      <th >Course Name</th>
                      
                      <th className='text-center' >Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tableRows

                    }
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
