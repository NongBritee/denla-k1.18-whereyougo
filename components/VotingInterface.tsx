'use client';

import React from 'react';
import { useVoting } from '../contexts/VotingContext';
import SchoolCard from './SchoolCard';

const VotingInterface: React.FC = () => {
  const { schools, currentMode, voterName, submitVote, userVote, room } = useVoting();

  if (!currentMode) return null;

  if (currentMode === 'named' && !voterName.trim()) {
    return (
      <div className="text-center text-red-500">
        กรุณาใส่ชื่อก่อนโหวต
      </div>
    );
  }

  const satitSchools = schools.filter(s => s.type === 'สาธิต');
  const catholicSchools = schools.filter(s => s.type === 'คาทอลิก');

  const handleVote = (schoolId: string) => {
    submitVote(schoolId);
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">เลือกโรงเรียนที่ต้องการ</h2>

      {userVote && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
          คุณได้เลือกโรงเรียน: {schools.find(s => s.id === userVote.schoolId)?.name} (โหมด: {userVote.mode === 'named' ? 'ระบุชื่อ' : 'ไม่ระบุชื่อ'}){room ? ` ห้อง: ${room}` : ''}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel: สาธิต */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center bg-blue-100 p-3 rounded-lg">
              โรงเรียนสาธิต
            </h3>
            {satitSchools.map(school => (
              <SchoolCard
                key={school.id}
                school={school}
                onVote={handleVote}
                isSelected={userVote?.schoolId === school.id}
              />
            ))}
          </div>

          {/* Right Panel: คาทอลิก */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center bg-green-100 p-3 rounded-lg">
              โรงเรียนคาทอลิก
            </h3>
            {catholicSchools.map(school => (
              <SchoolCard
                key={school.id}
                school={school}
                onVote={handleVote}
                isSelected={userVote?.schoolId === school.id}
              />
            ))}
          </div>
        </div>
    </div>
  );
};

export default VotingInterface;