import { useState, useEffect, useContext } from 'react';
import { ServiceContext } from '../contexts';
import setHours from 'date-fns/setHours';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import addDays from 'date-fns/addDays';

export const HORA_MINIMA_SOLICITUD = 15; //hora militar
export const HORAS_DE_ANTELACION = 4;

export function useServicePriority() {
  const { selectedPlace } = useContext(ServiceContext);
  const [minimumDate, setMinimumDate] = useState(new Date());
  const [minHour, setMinHour] = useState<number[]>([0, 0]);
  const [maxHour, setMaxHour] = useState<number[]>([23, 59]);

  const determineHourRange = (date: Date) => {
    if (differenceInCalendarDays(date, minimumDate) >= 1) {
      setMinHour([0, 0]);
      setMaxHour([23, 59]);
    } else {
      setMinHour([4, 0]);
      setMaxHour([23, 59]);
    }
  };

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
    if (selectedPlace?.city) {
      const minimumDays = getMinimumDays(selectedPlace?.city?.service_priority);
      const minDate = addDays(setHours(new Date(), HORAS_DE_ANTELACION), minimumDays);
      setMinimumDate(minDate);
      determineHourRange(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlace]);

  return { minimumDate, minHour, maxHour, determineHourRange };
}
