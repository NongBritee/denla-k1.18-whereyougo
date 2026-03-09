import ModeSelector from '../components/ModeSelector';
import VoterInfo from '../components/VoterInfo';
import RoomSelector from '../components/RoomSelector';
import AddSchoolForm from '../components/AddSchoolForm';
import VotingInterface from '../components/VotingInterface';
import ResultsDisplay from '../components/ResultsDisplay';
import { VotingProvider } from '../contexts/VotingContext';

export default function Home() {
  return (
    <VotingProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-1 border-gradient-to-r from-blue-400 to-purple-400">
            <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              แบบสอบถามคุณพ่อ คุณแม่น้องๆ K1.18
            </h1>
            <p className="text-center text-gray-600">แชร์โรงเรียนลูกๆกันค่ะ</p>
            <p className="text-center text-md text-yellow-600 mb-4">ข้อมูลจะถูกเก็บรักษาไว้เพียง 30 วัน นับตั้งแต่ 8 Mar 2026</p>
          </div>
          <div className="space-y-6">
            <ModeSelector />
            <VoterInfo />
            <RoomSelector />
            <VotingInterface />
            <AddSchoolForm />
            <ResultsDisplay />
          </div>
        </div>
      </div>
    </VotingProvider>
  );
}
