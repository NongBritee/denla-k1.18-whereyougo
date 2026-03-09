import { NextRequest, NextResponse } from 'next/server';
import { School, Vote } from '../../../types/voting';
import { readServerState, writeServerState } from '../../../lib/serverState';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type StateAction =
  | {
      action: 'submitVote';
      payload: {
        schoolId: string;
        voterName?: string;
        room?: string;
        deviceId: string;
        mode: 'anonymous' | 'named';
      };
    }
  | {
      action: 'resetVote';
      payload: { deviceId: string };
    }
  | {
      action: 'addSchool';
      payload: { school: Omit<School, 'id'> };
    }
  | {
      action: 'deleteSchool';
      payload: { schoolId: string };
    };

export async function GET() {
  const state = await readServerState();
  return NextResponse.json(state);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as StateAction;
  const state = await readServerState();

  switch (body.action) {
    case 'submitVote': {
      const { schoolId, voterName, room, deviceId, mode } = body.payload;

      const newVote: Vote = {
        id: Date.now().toString(),
        schoolId,
        voterName,
        room,
        deviceId,
        timestamp: new Date().toISOString(),
        mode,
      };

      const votes = [...state.votes.filter(v => v.deviceId !== deviceId), newVote];
      const nextState = { ...state, votes };
      await writeServerState(nextState);
      return NextResponse.json({ ...nextState, userVote: newVote });
    }

    case 'resetVote': {
      const { deviceId } = body.payload;
      const votes = state.votes.filter(v => v.deviceId !== deviceId);
      const nextState = { ...state, votes };
      await writeServerState(nextState);
      return NextResponse.json({ ...nextState, userVote: undefined });
    }

    case 'addSchool': {
      const { school } = body.payload;
      const isDuplicate = state.schools.some(
        s => s.name.toLowerCase().trim() === school.name.toLowerCase().trim()
      );

      if (isDuplicate) {
        return NextResponse.json({ ...state, duplicated: true });
      }

      const nextSchool: School = {
        ...school,
        id: `custom-${Date.now()}`,
      };

      const nextState = { ...state, schools: [...state.schools, nextSchool] };
      await writeServerState(nextState);
      return NextResponse.json({ ...nextState, duplicated: false });
    }

    case 'deleteSchool': {
      const { schoolId } = body.payload;
      const schools = state.schools.filter(s => s.id !== schoolId);
      const votes = state.votes.filter(v => v.schoolId !== schoolId);
      const nextState = { schools, votes };
      await writeServerState(nextState);
      return NextResponse.json(nextState);
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
