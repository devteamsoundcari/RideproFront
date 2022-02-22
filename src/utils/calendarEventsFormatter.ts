import { ALL_PROFILES } from '.';

export const calendarEventsFormatter = (rowStep: number, userProfile) => {
  const foundProfile: any = ALL_PROFILES.find((user) => user.profile === userProfile)?.steps;
  const stepsKeys = Object.keys(foundProfile);
  const filtered: any = stepsKeys.filter((key) => foundProfile[key].step === rowStep);
  return foundProfile[filtered];
};
