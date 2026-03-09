'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { School, Vote, VotingState } from '../types/voting';
import { schools } from '../data/schools';

interface VotingContextType extends VotingState {
  setMode: (mode: 'anonymous' | 'named') => void;
  setVoterName: (name: string) => void;
  setRoom: (room: string) => void;
  submitVote: (schoolId: string) => Promise<void>;
  resetVote: () => Promise<void>;
  addSchool: (school: Omit<School, 'id'>) => Promise<void>;
  deleteSchool: (schoolId: string) => Promise<void>;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

interface ServerStateResponse {
  schools: School[];
  votes: Vote[];
  userVote?: Vote;
  duplicated?: boolean;
}

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within VotingProvider');
  }
  return context;
};

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<VotingState>({
    schools,
    votes: [],
    currentMode: null,
    voterName: '',
    room: '',
    userVote: undefined,
    deviceId: '',
  });

  const syncFromServer = async (deviceId: string) => {
    try {
      const response = await fetch('/api/state', { cache: 'no-store' });
      if (!response.ok) return;

      const serverState = (await response.json()) as ServerStateResponse;
      setState(prev => ({
        ...prev,
        schools: serverState.schools,
        votes: serverState.votes,
        userVote: serverState.votes.find(v => v.deviceId === deviceId),
      }));
    } catch {
      // Keep existing local state when server is temporarily unavailable.
    }
  };

  const postStateAction = async (action: unknown): Promise<ServerStateResponse | null> => {
    try {
      const response = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as ServerStateResponse;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem('deviceId', deviceId);
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(prev => ({
        ...prev,
        currentMode: localStorage.getItem('currentMode') as 'anonymous' | 'named' | null,
        voterName: localStorage.getItem('voterName') || '',
        room: localStorage.getItem('room') || '',
        deviceId,
      }));

      void syncFromServer(deviceId);

      const intervalId = window.setInterval(() => {
        void syncFromServer(deviceId);
      }, 5000);

      return () => window.clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentMode', state.currentMode || '');
      localStorage.setItem('voterName', state.voterName);
      localStorage.setItem('room', state.room);
      if (state.deviceId) {
        localStorage.setItem('deviceId', state.deviceId);
      }
    }
  }, [state.currentMode, state.voterName, state.room, state.deviceId]);

  const setMode = (mode: 'anonymous' | 'named') => {
    setState(prev => ({ ...prev, currentMode: mode }));
  };

  const setVoterName = (name: string) => {
    setState(prev => ({ ...prev, voterName: name }));
  };

  const setRoom = (room: string) => {
    setState(prev => ({ ...prev, room }));
  };

  const submitVote = async (schoolId: string) => {
    if (!state.currentMode || !state.deviceId) return;

    const nextState = await postStateAction({
      action: 'submitVote',
      payload: {
        schoolId,
        voterName: state.currentMode === 'named' ? state.voterName : undefined,
        room: state.room || undefined,
        deviceId: state.deviceId,
        mode: state.currentMode,
      },
    });

    if (!nextState) return;

    setState(prev => ({
      ...prev,
      schools: nextState.schools,
      votes: nextState.votes,
      userVote: nextState.userVote || nextState.votes.find(v => v.deviceId === prev.deviceId),
    }));
  };

  const resetVote = async () => {
    if (!state.deviceId) return;

    const nextState = await postStateAction({
      action: 'resetVote',
      payload: { deviceId: state.deviceId },
    });

    if (!nextState) return;

    setState(prev => ({
      ...prev,
      schools: nextState.schools,
      votes: nextState.votes,
      userVote: undefined,
    }));
  };

  const addSchool = async (newSchool: Omit<School, 'id'>) => {
    const nextState = await postStateAction({
      action: 'addSchool',
      payload: { school: newSchool },
    });

    if (!nextState) return;
    if (nextState.duplicated) return;

    setState(prev => ({
      ...prev,
      schools: nextState.schools,
      votes: nextState.votes,
      userVote: nextState.votes.find(v => v.deviceId === prev.deviceId),
    }));
  };

  const deleteSchool = async (schoolId: string) => {
    const nextState = await postStateAction({
      action: 'deleteSchool',
      payload: { schoolId },
    });

    if (!nextState) return;

    setState(prev => ({
      ...prev,
      schools: nextState.schools,
      votes: nextState.votes,
      userVote: nextState.votes.find(v => v.deviceId === prev.deviceId),
    }));
  };

  return (
    <VotingContext.Provider value={{
      ...state,
      setMode,
      setVoterName,
      setRoom,
      submitVote,
      resetVote,
      addSchool,
      deleteSchool,
    }}>
      {children}
    </VotingContext.Provider>
  );
};