'use client';

import React from 'react';
import { useVoting } from '../contexts/VotingContext';

const ModeSelector: React.FC = () => {
  const { currentMode, setMode, userVote, resetVote } = useVoting();

  return (
    <div className="mb-6">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setMode('named')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentMode === 'named'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          โหมดระบุชื่อ
        </button>
        <button
          onClick={() => setMode('anonymous')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentMode === 'anonymous'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          โหมดไม่ระบุตัวตน
        </button>
        <button
          onClick={() => {
            if (!userVote) {
              alert('ยังไม่มีคำตอบให้ลบ');
              return;
            }
            if (confirm('ต้องการลบคำตอบของคุณหรือไม่?')) {
              resetVote();
            }
          }}
          className="px-6 py-3 rounded-lg font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
        >
          ลบคำตอบ
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;