import React from 'react';
import RegisterNewInstructor from './Registration/RegisterNewInstructor';
import { Row, Col } from 'react-bootstrap';
import './Instructors.scss';
import AllInstructors from './Listing/AllInstructors';

const InstructorView = () => {
  return (
    <Row>
      <Col>
        <RegisterNewInstructor />
        <AllInstructors />
      </Col>
    </Row>
  );
};

export default InstructorView;
