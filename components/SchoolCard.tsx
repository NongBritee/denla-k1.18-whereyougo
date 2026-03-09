'use client';

import React from 'react';
import { School } from '../types/voting';

interface SchoolCardProps {
  school: School;
  onVote: (schoolId: string) => void;
  isSelected?: boolean;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, onVote, isSelected }) => {
  return (
    <div className={`p-4 border rounded-lg shadow-md transition-all ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{school.name}</h3>
        <button
          onClick={() => onVote(school.id)}
          className=" bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          เลือกโรงเรียนนี้
        </button>
      </div>
      {school.description && (
        <p className="text-sm text-gray-600">{school.description}</p>
      )}
    </div>
  );
};

export default SchoolCard;