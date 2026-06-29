import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GlobalAgentState, PetMode, AppStep, Pet } from './types';

interface AgentActions {
  setMode: (mode: PetMode) => void;
  setStep: (step: AppStep) => void;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  reset: () => void;
}

const initialState: GlobalAgentState = {
  mode: null,
  currentStep: 'mode_select',
  pets: [],
};

export const useAgentStore = create<GlobalAgentState & AgentActions>()(
  immer((set) => ({
    ...initialState,

    setMode: (mode) => set((s) => {
      s.mode = mode;
    }),

    setStep: (step) => set((s) => {
      s.currentStep = step;
    }),

    addPet: (pet) => set((s) => {
      s.pets.push(pet);
    }),

    updatePet: (id, updates) => set((s) => {
      const pet = s.pets.find((p) => p.id === id);
      if (pet) Object.assign(pet, updates);
    }),

    reset: () => set(() => ({ ...initialState, pets: [] })),
  }))
);
