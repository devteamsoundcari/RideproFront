import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

export function StatusRenderer({ step }: any) {
  return (
    <div className="text-center" style={{ lineHeight: '15px' }}>
      <small>{step ? step.name : 'Evento Finalizado'}</small>{' '}
      {!step ? <FaCheckCircle className="text-success" /> : ''}
      <ProgressBar
        className="mt-1 shadow-sm"
        variant={step ? step.variant : 'event-finished'}
        now={step ? step.now : 100}
        label={step ? `${step.label}%` : 100}
        srOnly
      />
    </div>
  );
}
