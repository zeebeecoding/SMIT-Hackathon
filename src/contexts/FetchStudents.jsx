import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { firestore } from "../config/firebase";

const FetchStudents = createContext();

export default function FetchStudentsProvider({ children }) {
  const [getStudents, setGetstudents] = useState([]);

  const updateStudent = async (id, updatedData) => {
    try {
      const studentRef = doc(firestore, "students", id);
      await setDoc(studentRef, updatedData, { merge: true });
    } catch (error) {
      throw new Error("Error updating student: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "students"),
      (snapshot) => {
        const docArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGetstudents(docArray);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <FetchStudents.Provider
      value={{ getStudents, setGetstudents, updateStudent }}
    >
      {children}
    </FetchStudents.Provider>
  );
}

export const useFetchStudents = () => useContext(FetchStudents);
