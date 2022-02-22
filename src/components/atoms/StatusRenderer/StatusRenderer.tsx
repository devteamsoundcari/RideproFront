import React, { useState, useEffect, useContext } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../../../contexts';
import { ALL_PROFILES } from '../../../utils';

interface IStep {
  name?: string;
  variant?: string;
  now?: number;
  label?: string;
}

export function StatusRenderer({ rowStep }: any) {
  const { userInfo } = useContext(AuthContext);
  const [step, setStep] = useState<IStep>({ name: '', variant: '', now: 0 });

  useEffect(() => {
    const foundProfile: any = ALL_PROFILES.find((user) => user.profile === userInfo.profile);
    const stepsKeys = Object.keys(foundProfile?.steps);
    const filtered: any = stepsKeys.filter((key) => foundProfile.steps[key].step.includes(rowStep));
    setStep(foundProfile.steps[filtered]);
  }, [rowStep, userInfo.profile]);

  return (
    <div className="text-center" style={{ lineHeight: '15px' }}>
      <small>{step ? step?.name : 'Evento Finalizado'}</small>{' '}
      {!step ? <FaCheckCircle className="text-success" /> : ''}
      <ProgressBar
        className="mt-1 shadow-sm"
        variant={step ? step?.variant : 'event-finished'}
        now={step ? step?.now : 100}
        label={step ? `${step?.label}%` : 100}
        srOnly
      />
    </div>
  );
}
