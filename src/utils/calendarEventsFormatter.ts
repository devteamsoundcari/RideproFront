import { ALL_PROFILES } from '.';

export const calendarEventsFormatter = (rowStep: number, userProfile) => {
  console.log('kleeee');
  const foundProfile: any = ALL_PROFILES.find((user) => user.profile === userProfile)?.steps;
  const stepsKeys = Object.keys(foundProfile);
  const filtered: any = stepsKeys.filter((key) => foundProfile[key].step === rowStep);
  console.log(foundProfile[filtered]);
  return foundProfile[filtered];
};
