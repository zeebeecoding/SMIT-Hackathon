import React, { useCallback, useEffect, useState } from "react";
import { Divider } from "antd";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "config/firebase";

export default function Details() {
  const [course, setCourse] = useState({});
  const params = useParams();

  const getCourse = useCallback(async () => {
    onSnapshot(doc(firestore, "courses", params.id), (doc) => {
      const data = doc.data();
      setCourse(data);
      console.log("course", data);
    });
  }, [params.id]);

  useEffect(() => {
    getCourse();
  }, [getCourse]);

  return (
    <main className="py-5">
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h1>{course.title}</h1>
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
