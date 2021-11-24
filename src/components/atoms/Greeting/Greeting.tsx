import React from 'react';

export interface IGender {
  name: string;
  gender: string;
}

export const Greeting = ({ name, gender }: IGender) => {
  let greeting: string;

  switch (gender) {
    case 'M':
      greeting = `Bienvenido ${name}`;
      break;
    case 'F':
      greeting = `Bienvenida ${name}`;
      break;
    case 'O':
      greeting = `Bienvenid@ ${name}`;
      break;
    default:
      greeting = `Bienvenid@ ${name}`;
      break;
  }

  return <small>{greeting}</small>;
};
