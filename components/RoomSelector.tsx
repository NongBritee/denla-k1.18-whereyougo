'use client';

import React from 'react';
import { useVoting } from '../contexts/VotingContext';

const RoomSelector: React.FC = () => {
  const { room, setRoom } = useVoting();

  const rooms = ['K 2.10', 'K 2.11', 'K 2.19'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h3 className="text-lg font-semibold mb-4">เลือกห้องเรียน K2</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((roomOption) => (
          <div
            key={roomOption}
            onClick={() => setRoom(roomOption)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              room === roomOption
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-center font-semibold text-lg">{roomOption}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;