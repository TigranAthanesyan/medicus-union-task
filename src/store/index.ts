import { create } from 'zustand';
import { State } from './types';

export const useStore = create<State>((set) => ({
  doctors: [],
  specializations: [],
  
  setDoctors: (doctors) => set({ doctors }),
  setSpecializations: (specializations) => set({ specializations }),
})); 