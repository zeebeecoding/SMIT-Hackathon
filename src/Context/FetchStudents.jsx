import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { firestore } from '../config/firebase';

const FetchStudents = createContext();

export default function FetchStudentsProvider({ children }) {

    const [getStudents, setGetstudents] = useState([]);

    const showStudents = async () => {
       
        const querySnapshot = await getDocs(collection(firestore, "students"));

        const docArray = []

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            docArray.push(data)
        });
        setGetstudents(docArray)
       
    }
    useEffect(() => {
        showStudents();
    }, []);

    return (
        <FetchStudents.Provider value={{ getStudents ,setGetstudents }}>
            {children}
        </FetchStudents.Provider>
    );
}

export const useFetchStudents  = () => useContext(FetchStudents);
