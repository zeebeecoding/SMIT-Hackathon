import React from 'react';
import {PiStudent} from 'react-icons/pi'
import {MdSubject} from 'react-icons/md'
import {MdStickyNote2} from 'react-icons/md'
import { useFetchStudents } from '../../../Context/FetchStudents';
import { useFetchCourses } from '../../../Context/FetchCourses';
import { useFetchAttendence } from '../../../Context/FetchAttendence';


export default function Hero() {

  const { getStudents } = useFetchStudents()
  const { getCourse } = useFetchCourses()
  const { getAttendence } = useFetchAttendence()

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row p-4">
              <h1>Welcome, ........</h1>
            </div>
            <div className="row">
              <div className="col-md-12 col-lg-4 mb-4 mb-md-0">
                <div className='homeTag1' style={{background:"#c6f4fe"}}>
                  <span className='tagIcon'><PiStudent size={22} /> </span>
                  <span>{getStudents.length} <p>Students</p> </span>
                </div>
              </div>
              <div className="col-md-12 col-lg-4 mb-4 mb-md-0">
                <div className='homeTag1'style={{background:"#fbdfee"}}>
                  <span className='tagIcon'><MdSubject size={22} /> </span>
                  <span>{getCourse.length}<p>Courses</p> </span>
                </div>
              </div>
              <div className="col-md-12 col-lg-4">
                <div className='homeTag1'style={{background:"#bde0fe"}}>
                  <span className='tagIcon'><MdStickyNote2 size={22} /> </span>
                  <span>{getAttendence.length} <p>Attendence</p> </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
