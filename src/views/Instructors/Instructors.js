import React, { useEffect, useState } from "react";
import RegisterNewInstructor from "./Registration/RegisterNewInstructor";
import { Row, Col } from "react-bootstrap";
import "./Instructors.scss";
import AllInstructors from "./Listing/AllInstructors";
import { getInstructors } from "../../controllers/apiRequests";


const InstructorView = () => {
  const [instructors, setInstructors] = useState([]);

  const fetchInstructors = async (url) => {
    let obtainedInstructors = [];
    const response = await getInstructors(url);
    response.results.forEach(async (item) => {
      obtainedInstructors.push(item);
    });
    setInstructors(obtainedInstructors);
    if (response.next) {
      return await getInstructors(response.next);
    }
  };

  useEffect(() => {
    fetchInstructors(`${process.env.REACT_APP_API_URL}/api/v1/instructors/`);
  }, []);

  return (
    <Row>
      <Col>
        <RegisterNewInstructor />
        <AllInstructors instructors={instructors} />
      </Col>
    </Row>
  );
};

export default InstructorView;
