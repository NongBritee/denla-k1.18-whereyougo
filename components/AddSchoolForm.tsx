'use client';

import React, { useState } from 'react';
import { useVoting } from '../contexts/VotingContext';

const AddSchoolForm: React.FC = () => {
  const { addSchool, schools } = useVoting();
  const [name, setName] = useState('');
  const [type, setType] = useState<'สาธิต' | 'คาทอลิก'>('สาธิต');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Check for duplicate
      const isDuplicate = schools.some(
        s => s.name.toLowerCase().trim() === name.toLowerCase().trim()
      );

      if (isDuplicate) {
        setMessage('โรงเรียนนี้มีอยู่แล้ว');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      addSchool({ name: name.trim(), type, description: description.trim() || undefined });
      setMessage('เพิ่มโรงเรียนสำเร็จ');
      setName('');
      setDescription('');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
      <h3 className="text-lg font-semibold mb-4">เพิ่มโรงเรียน (หากไม่อยู่ใน list ด้านบนครับ)</h3>
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
          message.includes('สำเร็จ') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อโรงเรียน
          </label>
          <input
            id="schoolName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="ใส่ชื่อโรงเรียน"
            required
          />
        </div>
        <div>
          <label htmlFor="schoolType" className="block text-sm font-medium text-gray-700 mb-1">
            ประเภทโรงเรียน
          </label>
          <select
            id="schoolType"
            value={type}
            onChange={(e) => setType(e.target.value as 'สาธิต' | 'คาทอลิก')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="สาธิต">สาธิต</option>
            <option value="คาทอลิก">คาทอลิก</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          เพิ่มโรงเรียน
        </button>
      </form>
    </div>
  );
};

export default AddSchoolForm;