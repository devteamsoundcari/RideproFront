import { ALL_PROFILES } from './constants';

export const getProfile = (userProfile) =>
  ALL_PROFILES.find(
    ({ profile }) => profile === userProfile
  )?.name.toLocaleLowerCase();
