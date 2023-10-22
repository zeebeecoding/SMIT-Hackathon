import { collection, getDocs } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { firestore } from "../config/firebase";

const FetchCourses = createContext();

export default function FetchCoursesProvider({ children }) {
  const [getCourse, setGetCourse] = useState([]);

  const showCourses = async () => {
    const querySnapshot = await getDocs(collection(firestore, "courses"));

    const docArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      docArray.push(data);
    });
    setGetCourse(docArray);
  };
  useEffect(() => {
    showCourses();
  }, []);

  return (
    <FetchCourses.Provider value={{ getCourse, setGetCourse }}>
      {children}
    </FetchCourses.Provider>
  );
}

export const useFetchCourses = () => useContext(FetchCourses);
