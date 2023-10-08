import React, { useCallback, useEffect, useState } from "react";
import { Divider } from "antd";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "config/firebase";

export default function Details() {
  const [student, setStudent] = useState({});
  const params = useParams();

  const getStudent = useCallback(async () => {
    onSnapshot(doc(firestore, "students", params.id), (doc) => {
      const data = doc.data();
      setStudent(data);
      console.log("student", data);
    });
  }, [params.id]);

  useEffect(() => {
    getStudent();
  }, [getStudent]);

  return (
    <main className="py-5">
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h1>{student.title}</h1>
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
