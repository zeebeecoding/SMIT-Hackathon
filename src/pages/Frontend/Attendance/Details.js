import React, { useCallback, useEffect, useState } from "react";
import { Divider } from "antd";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "config/firebase";

export default function Details() {
  const [attendence, setAttendence] = useState({});
  const params = useParams();

  const getAttendence = useCallback(async () => {
    onSnapshot(doc(firestore, "attendences", params.id), (doc) => {
      const data = doc.data();
      setAttendence(data);
      console.log("attendences", data);
    });
  }, [params.id]);

  useEffect(() => {
    getAttendence();
  }, [getAttendence]);

  return (
    <main className="py-5">
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h1>{attendence.title}</h1>
          </div>
        </div>
        <Divider />

        <div className="row">
          <div className="col"></div>
        </div>
      </div>
    </main>
  );
}
