import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

export const dateDDMMYYYnTime = (date) => moment(date).format('DD/MM/YY | h:mm a');

export const dateDDMMYYY = (date) => moment(date).format('DD/MM/YYYY');

export const dateAMPM = (date) => moment(date).format('h:mm a');

export const dateToCalendar = (date) => moment(date).calendar();

export const dateFromNow = (date) => moment(moment(date)).fromNow();

export const dateWithTime = (date) => moment(date).format('MMMM D YYYY, h:mm a');

export const dateMonthName = (date) => moment(date).format('MMMM');
