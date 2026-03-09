import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { schools as defaultSchools } from '../data/schools';
import { School, Vote } from '../types/voting';

export interface ServerState {
  schools: School[];
  votes: Vote[];
}

const STATE_FILE = path.join(os.tmpdir(), 'denla-k1-18-state.json');

const initialState: ServerState = {
  schools: defaultSchools,
  votes: [],
};

async function ensureStateFile(): Promise<void> {
  try {
    await fs.access(STATE_FILE);
  } catch {
    await fs.writeFile(STATE_FILE, JSON.stringify(initialState, null, 2), 'utf8');
  }
}

export async function readServerState(): Promise<ServerState> {
  await ensureStateFile();
  const raw = await fs.readFile(STATE_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw) as Partial<ServerState>;
    return {
      schools: Array.isArray(parsed.schools) ? parsed.schools : defaultSchools,
      votes: Array.isArray(parsed.votes) ? parsed.votes : [],
    };
  } catch {
    await fs.writeFile(STATE_FILE, JSON.stringify(initialState, null, 2), 'utf8');
    return initialState;
  }
}

export async function writeServerState(state: ServerState): Promise<void> {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}
