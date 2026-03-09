import { School } from '../types/voting';

export const schools: School[] = [
  // สาธิต schools
  {
    id: 'satit-chula',
    name: 'โรงเรียนสาธิตจุฬาฯ',
    type: 'สาธิต',
  },
  {
    id: 'satit-thammasat',
    name: 'โรงเรียนสาธิต มศว',
    type: 'สาธิต',
  },
  {
    id: 'satit-khonkaen',
    name: 'โรงเรียนสาธิตเกษตรศาสตร์',
    type: 'สาธิต',
  },
  // คาทอลิก schools
  {
    id: 'catholic-stjoseph',
    name: 'โรงเรียนเซนต์โยเซฟ',
    type: 'คาทอลิก',
  },
  {
    id: 'catholic-assumption',
    name: 'โรงเรียนอัสสัมชัญ',
    type: 'คาทอลิก',
  },
  {
    id: 'catholic-stgabriel',
    name: 'โรงเรียนเซนต์คาเบรียล',
    type: 'คาทอลิก',
  }
];