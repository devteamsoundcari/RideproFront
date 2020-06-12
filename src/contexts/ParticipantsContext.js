import React, { createContext, useState } from "react";

export const ParticipantsContext = createContext();

const ParticipantsContextProvider = (props) => {
  const [
    participantsToRegisterContext,
    setParticipantsToRegisterContext,
  ] = useState([]);
  const [
    registeredParticipantsContext,
    setRegisteredParticipantsContext,
  ] = useState([]);
  const [
    allParticipantsInfoContext,
    setAllParticipantsInfoContext
  ] = useState([]);
  const [
    unregisteredParticipantsContext,
    setUnregisteredParticipantsContext
  ] = useState([]);

  return (
    <ParticipantsContext.Provider
      value={{
        participantsToRegisterContext,
        setParticipantsToRegisterContext,
        registeredParticipantsContext,
        setRegisteredParticipantsContext,
        allParticipantsInfoContext,
        setAllParticipantsInfoContext,
        unregisteredParticipantsContext,
        setUnregisteredParticipantsContext
      }}
    >
      {props.children}
    </ParticipantsContext.Provider>
  );
};

export default ParticipantsContextProvider;
