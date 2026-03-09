'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { School, Vote, VotingState } from '../types/voting';
import { schools } from '../data/schools';

interface VotingContextType extends VotingState {
  setMode: (mode: 'anonymous' | 'named') => void;
  setVoterName: (name: string) => void;
  setRoom: (room: string) => void;
  submitVote: (schoolId: string) => void;
  resetVote: () => void;
  addSchool: (school: Omit<School, 'id'>) => void;
  deleteSchool: (schoolId: string) => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

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

  // Generate or load device ID on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        // Generate new device ID
        deviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
      }

      const storedVotes = localStorage.getItem('votes') ? JSON.parse(localStorage.getItem('votes')!) : [];
      const storedUserVote = localStorage.getItem('userVote') ? JSON.parse(localStorage.getItem('userVote')!) : undefined;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(prev => ({
        ...prev,
        votes: storedVotes,
        userVote: storedUserVote || storedVotes.find((v: Vote) => v.deviceId === deviceId),
        currentMode: localStorage.getItem('currentMode') as 'anonymous' | 'named' | null,
        voterName: localStorage.getItem('voterName') || '',
        room: localStorage.getItem('room') || '',
        deviceId,
      }));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('votes', JSON.stringify(state.votes));
      if (state.userVote) {
        localStorage.setItem('userVote', JSON.stringify(state.userVote));
      } else {
        localStorage.removeItem('userVote');
      }
      localStorage.setItem('currentMode', state.currentMode || '');
      localStorage.setItem('voterName', state.voterName);
      localStorage.setItem('room', state.room);
    }
  }, [state.votes, state.userVote, state.currentMode, state.voterName, state.room]);

  const setMode = (mode: 'anonymous' | 'named') => {
    setState(prev => ({ ...prev, currentMode: mode }));
  };

  const setVoterName = (name: string) => {
    setState(prev => ({ ...prev, voterName: name }));
  };

  const setRoom = (room: string) => {
    setState(prev => ({ ...prev, room }));
  };

  const submitVote = (schoolId: string) => {
    const newVote: Vote = {
      id: Date.now().toString(),
      schoolId,
      voterName: state.currentMode === 'named' ? state.voterName : undefined,
      room: state.room || undefined,
      deviceId: state.deviceId,
      timestamp: new Date(),
      mode: state.currentMode!,
    };

    setState(prev => {
      // Keep exactly one vote per device by replacing existing device vote.
      const filteredVotes = prev.votes.filter(v => v.deviceId !== prev.deviceId);

      return {
        ...prev,
        votes: [...filteredVotes, newVote],
        userVote: newVote,
      };
    });
  };

  const resetVote = () => {
    setState(prev => {
      // Remove all votes from this device.
      const filteredVotes = prev.votes.filter(v => v.deviceId !== prev.deviceId);

      return {
        ...prev,
        votes: filteredVotes,
        userVote: undefined,
      };
    });
  };

  const addSchool = (newSchool: Omit<School, 'id'>) => {
    // Check for duplicate school name (case-insensitive)
    const isDuplicate = state.schools.some(
      s => s.name.toLowerCase().trim() === newSchool.name.toLowerCase().trim()
    );

    if (isDuplicate) {
      return; // Don't add duplicate school
    }

    const school: School = {
      ...newSchool,
      id: `custom-${Date.now()}`,
    };
    setState(prev => ({
      ...prev,
      schools: [...prev.schools, school],
    }));
  };

  const deleteSchool = (schoolId: string) => {
    setState(prev => ({
      ...prev,
      schools: prev.schools.filter(s => s.id !== schoolId),
      // Remove votes for this school
      votes: prev.votes.filter(v => v.schoolId !== schoolId),
      userVote: prev.userVote?.schoolId === schoolId ? undefined : prev.userVote,
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