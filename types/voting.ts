export interface School {
  id: string;
  name: string;
  type: 'สาธิต' | 'คาทอลิก';
  description?: string;
}

export interface Vote {
  id: string;
  schoolId: string;
  voterName?: string;
  room?: string;
  deviceId: string;
  timestamp: Date;
  mode: 'anonymous' | 'named';
}

export interface VotingState {
  schools: School[];
  votes: Vote[];
  currentMode: 'anonymous' | 'named' | null;
  voterName: string;
  room: string;
  userVote?: Vote;
  deviceId: string;
}