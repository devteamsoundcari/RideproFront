import { ALL_PROFILES } from '.';

export const calendarEventsFormatter = (rowStep: number, userProfile) => {
  const foundProfile: any = ALL_PROFILES.find((user) => user.profile === userProfile);
  const stepsKeys = Object.keys(foundProfile?.steps);
  const filtered: any = stepsKeys.filter((key) => foundProfile.steps[key].step.includes(rowStep));
  return foundProfile.steps[filtered];
};
