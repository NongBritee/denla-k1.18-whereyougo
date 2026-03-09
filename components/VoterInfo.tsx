'use client';

import React from 'react';
import { useVoting } from '../contexts/VotingContext';
import AutocompleteInput from './AutocompleteInput';
import { studentNames } from '../data/names';

const VoterInfo: React.FC = () => {
  const { currentMode, voterName, setVoterName } = useVoting();

  if (currentMode !== 'named') return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <AutocompleteInput
        value={voterName}
        onChange={setVoterName}
        suggestions={studentNames}
        placeholder="กรุณาเลือกหรือใส่ชื่อน้อง"
        label="ชื่อน้อง"
      />
    </div>
  );
};

export default VoterInfo;