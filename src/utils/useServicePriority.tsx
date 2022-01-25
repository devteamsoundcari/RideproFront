import { useState, useEffect, useContext } from 'react';
import { ServiceContext } from '../contexts';
import setHours from 'date-fns/setHours';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import addDays from 'date-fns/addDays';

export const HORA_MINIMA_SOLICITUD = 15; //hora militar
export const HORAS_DE_ANTELACION = 4;

export function useServicePriority() {
  const { selectedCity } = useContext(ServiceContext);
  const [minimumDate, setMinimumDate] = useState(new Date());
  const [minHour, setMinHour] = useState<number[]>([0, 0]);
  const [maxHour, setMaxHour] = useState<number[]>([23, 59]);

  const determineHourRange = (date, minDate) => {
    if (differenceInCalendarDays(date, minDate) >= 1) {
      setMinHour([0, 0]);
      setMaxHour([23, 59]);
    } else {
      setMinHour([4, 0]);
      setMaxHour([23, 59]);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      determineHourRange(selectedCity, minimumDate);
    }
    // eslint-disable-next-line
  }, [selectedCity]);

  const getMinimumDays = (priority: number) => {
    const now = new Date().getHours();
    switch (priority) {
      case 0:
        if (now < HORA_MINIMA_SOLICITUD) {
          return 2;
        } else {
          return 3;
        }
      case 1:
        if (now < HORA_MINIMA_SOLICITUD) {
          return 1;
        } else {
          return 2;
        }
      default:
        if (now < HORA_MINIMA_SOLICITUD) {
          return 2;
        } else {
          return 3;
        }
    }
  };

  useEffect(() => {
    console.log('selectedCity', selectedCity);
    if (selectedCity?.service_priority) {
      const minimumDays = getMinimumDays(selectedCity.service_priority);
      const minDate = addDays(setHours(new Date(), HORAS_DE_ANTELACION), minimumDays);
      setMinimumDate(minDate);
    }
  }, [selectedCity]);

  return { minimumDate, minHour, maxHour };
}
