import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { firestore } from '../config/firebase';

const FetchAttendence = createContext();

export default function FetchAttendenceProvider({ children }) {

    const [getAttendence, setGetAttendence] = useState([]);

    const showAttendence = async () => {
       
        const querySnapshot = await getDocs(collection(firestore, "attendence"));

        const docArray = []

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            docArray.push(data)
        });
        setGetAttendence(docArray)
       
    }
    useEffect(() => {
        showAttendence();
    }, []);

    return (
        <FetchAttendence.Provider value={{ getAttendence ,setGetAttendence }}>
            {children}
        </FetchAttendence.Provider>
    );
}

export const useFetchAttendence = () => useContext(FetchAttendence);
