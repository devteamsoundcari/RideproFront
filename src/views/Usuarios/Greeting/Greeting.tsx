import React from "react";

const Greeting = (props: any) => {
  const name = props.name;
  const gender = props.gender;
  let greeting: string;

  switch (gender) {
    case "M":
      greeting = `Bienvenido ${name}`;
      break;
    case "F":
      greeting = `Bienvenida ${name}`;
      break;
    case "O":
      greeting = `Bienvenid@ ${name}`;
      break;
    default:
      greeting = `Bienvenid@ ${name}`;
      break;
  }

  return <small>{greeting}</small>;
};

export default Greeting;
