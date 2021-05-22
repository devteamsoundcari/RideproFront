import React, { useEffect, useState } from 'react';
import RegisterNewInstructor from './Registration/RegisterNewInstructor';
import { Row, Col } from 'react-bootstrap';
import './Instructors.scss';
import AllInstructors from './Listing/AllInstructors';
import { getInstructors } from '../../controllers/apiRequests';

const InstructorView = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInstructors = async (url) => {
    setLoading(true);
    let obtainedInstructors = [];
    const response = await getInstructors(url);
    response.results.forEach(async (item) => {
      obtainedInstructors.push(item);
    });
    setInstructors((oldArray) => [...oldArray, ...obtainedInstructors]);
    setLoading(false);

    if (response.next) {
      return await fetchInstructors(response.next);
    }
  };

  useEffect(() => {
    fetchInstructors(`${process.env.REACT_APP_API_URL}/api/v1/instructors/`);
    //eslint-disable-next-line
  }, []);

  return (
    <Row>
      <Col>
        <RegisterNewInstructor loading={loading} />
        <AllInstructors instructors={instructors} />
      </Col>
    </Row>
  );
};

export default InstructorView;
