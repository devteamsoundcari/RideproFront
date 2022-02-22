import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ModalAddInstructor } from '../../components/molecules';
import { MainLayout } from '../../components/templates';

export interface IInstructoresProps {}

export function Instructores(props: IInstructoresProps) {
  const [showModalAddInstructor, setShowModalAddInstructor] = useState(false);
  return (
    <MainLayout>
      Instructores:
      <Button onClick={() => setShowModalAddInstructor(true)}>
        Agregar instructor
      </Button>
      {showModalAddInstructor && (
        <ModalAddInstructor
          handleClose={() => setShowModalAddInstructor(false)}
        />
      )}
    </MainLayout>
  );
}
