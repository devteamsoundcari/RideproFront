import React, { useState } from 'react';
import RegisterNewInstructor from './Registration/RegisterNewInstructor';
import { Row, Col } from 'react-bootstrap';
import './Instructors.scss';
import AllInstructors from './Listing/AllInstructors';

const InstructorView = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Row>
      <Col>
        <RegisterNewInstructor loading={loading} />
        <AllInstructors />
      </Col>
    </Row>
  );
};

export default InstructorView;
