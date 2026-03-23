import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), '.leadso_store.json');

export interface AppConfig {
  apifyKey: string;
  anthropicKey: string;
  anymailfinderKey: string;
}

export interface Job {
  id: string;
  name: string;
  date: string;
  leads: number;
  verified: number;
  percent: string;
  status: 'Pending' | 'Completed' | 'Failed';
  rawResults?: any[];
  enrichedResults?: any[];
  error?: string;
}

export interface StoreData {
  config: AppConfig;
  jobs: Job[];
}

const DEFAULT_DATA: StoreData = {
  config: {
    apifyKey: '',
    anthropicKey: '',
    anymailfinderKey: '',
  },
  jobs: []
};

function ensureStoreExists() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

export function getStore(): StoreData {
  ensureStoreExists();
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
}

export function saveStore(data: StoreData) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

// Config Helpers
export function getConfig(): AppConfig {
  return getStore().config;
}

export function saveConfig(config: AppConfig) {
  const store = getStore();
  store.config = config;
  saveStore(store);
}

// Job Helpers
export function getJobs(): Job[] {
  return getStore().jobs;
}

export function getJob(id: string): Job | undefined {
  return getStore().jobs.find(j => j.id === id);
}

export function addJob(job: Job) {
  const store = getStore();
  store.jobs.unshift(job); // Add to beginning
  saveStore(store);
}

export function updateJob(id: string, updates: Partial<Job>) {
  const store = getStore();
  const index = store.jobs.findIndex(j => j.id === id);
  if (index !== -1) {
    store.jobs[index] = { ...store.jobs[index], ...updates };
    saveStore(store);
  }
}
