import React, { createContext, useState } from 'react';

export const ParticipantsContext = createContext();

export const ParticipantsContextProvider = (props) => {
  const [participantsToRegisterContext, setParticipantsToRegisterContext] =
    useState([]);
  const [registeredParticipantsContext, setRegisteredParticipantsContext] =
    useState([]);
  const [allParticipantsInfoContext, setAllParticipantsInfoContext] = useState(
    []
  );
  const [unregisteredParticipantsContext, setUnregisteredParticipantsContext] =
    useState([]);
  const [newParticipantsContext, setNewParticipantsContext] = useState([]);

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
        setUnregisteredParticipantsContext,
        newParticipantsContext,
        setNewParticipantsContext
      }}>
      {props.children}
    </ParticipantsContext.Provider>
  );
};
