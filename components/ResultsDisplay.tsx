'use client';

import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useVoting } from '../contexts/VotingContext';

interface ResultsDisplayProps {
  isAdmin?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isAdmin = false }) => {
  const { schools, votes, userVote, room, deleteSchool } = useVoting();

  const voteCounts = schools.map(school => ({
    ...school,
    count: votes.filter(v => v.schoolId === school.id).length,
    voters: votes.filter(v => v.schoolId === school.id).map(v => ({
      name: v.voterName || 'ไม่ระบุชื่อ',
      room: v.room,
      deviceId: v.deviceId,
    })),
  }));

  const totalVotes = votes.length;

  return (
    <div id="results-section" className="mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">รายงานผลแบบสอบถาม</h2>
      <p className="text-center mb-4">จำนวนทั้งหมด: {totalVotes}</p>
      <p className="text-center text-md text-yellow-600 mb-4">ข้อมูลจะถูกเก็บรักษาไว้เพียง 30 วัน</p>

      {userVote && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center">
          การเลือกของคุณ: {schools.find(s => s.id === userVote.schoolId)?.name}{room ? ` (${room})` : ''}
        </div>
      )}

      <div className="space-y-6">
        {voteCounts
        .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type))
        .map(school => (
          <div key={school.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold">{school.name}</h3>
                <p className={`text-sm ${school.type === 'สาธิต' ? 'text-blue-600' : 'text-green-600'}`}>{school.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold">{school.count}</div>
                  <div className="text-sm text-gray-500">
                    {totalVotes > 0 ? ((school.count / totalVotes) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`ต้องการลบ "${school.name}" หรือไม่?`)) {
                        deleteSchool(school.id);
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    ลบ
                  </button>
                )}
              </div>
            </div>
            {school.voters.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">ชื่อน้อง:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {school.voters.map((voter, index) => (
                    <li key={index}>
                      {voter.name}{voter.room ? ` (${voter.room})` : ' (ไม่ระบุห้อง)'}
                      {isAdmin && <span className="text-xs text-gray-400 ml-1">[{voter.deviceId}]</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalVotes > 0 && (
        <div className="mt-12 w-full">
          <h3 className="text-2xl font-bold mb-6 text-center"></h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={voteCounts.map(school => ({
                  name: school.name,
                  value: school.count,
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => {
                  const safePercent = percent ?? 0;
                  return safePercent > 0 ? `${name}: ${value} (${(safePercent * 100).toFixed(1)}%)` : '';
                }}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {voteCounts.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} votes`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;