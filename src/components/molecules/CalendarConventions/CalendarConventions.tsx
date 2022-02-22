import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts';
import { ALL_PROFILES } from '../../../utils';
import './CalendarConventions.scss';

export const CalendarConventions = () => {
  const { userInfo } = useContext(AuthContext);
  const [currentProfileStatus, setCurrentProfileStatus] = useState<any>(null);

  useEffect(() => {
    let foundProfile: any = ALL_PROFILES.find((user) => user.profile === userInfo.profile);
    foundProfile = Object.values(foundProfile.steps);
    setCurrentProfileStatus(foundProfile);
  }, [userInfo]);

  return (
    <nav className="calendar-nav">
      {currentProfileStatus &&
        currentProfileStatus.map(({ variant, name, id }) => (
          <a role="button" href="/" className="text-capitalize" key={id}>
            <span className={`bg-${variant}`}></span> {name}
          </a>
        ))}
    </nav>
  );
};
