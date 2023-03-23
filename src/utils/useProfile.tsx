import { useState, useEffect, useContext } from 'react';
import { ALL_PROFILES } from '.';
import { AuthContext } from '../contexts/AuthContext';

export function useProfile() {
  const { userInfo } = useContext(AuthContext) as any;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (userInfo) {
      const res = ALL_PROFILES.find(
        ({ profile }) => profile === userInfo.profile
      )?.name.toLocaleLowerCase();
      setProfile(res as any);
    }
  }, [userInfo]);
  return [profile];
}
