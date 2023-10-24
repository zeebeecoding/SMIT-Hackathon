import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { firestore } from "../config/firebase";

const FetchCourses = createContext();

export default function FetchCoursesProvider({ children }) {
  const [getCourses, setGetCourses] = useState([]);

  const showCourses = async () => {
    const querySnapshot = await getDocs(collection(firestore, "courses"));

    const docArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      docArray.push({ id: doc.id, ...data });
    });
    setGetCourses(docArray);
  };

  const updateCourse = async (id, updatedData) => {
    try {
      const courseRef = doc(firestore, "courses", id);
      await setDoc(courseRef, updatedData, { merge: true });
    } catch (error) {
      throw new Error("Error updating course: " + error.message);
    }
  };

  useEffect(() => {
    showCourses();

    // Set up a real-time listener for courses
    const unsubscribe = onSnapshot(
      collection(firestore, "courses"),
      (snapshot) => {
        const docArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          docArray.push({ id: doc.id, ...data });
        });
        setGetCourses(docArray);
      }
    );

    return () => unsubscribe(); // Clean up the listener when the component is unmounted
  }, []);

  return (
    <FetchCourses.Provider value={{ getCourses, setGetCourses, updateCourse }}>
      {children}
    </FetchCourses.Provider>
  );
}

export const useFetchCourses = () => useContext(FetchCourses);
