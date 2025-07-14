import { create } from 'zustand';
import { State } from './types';

export const useStore = create<State>((set, get) => ({
  doctors: [],
  doctorMapById: {},
  specializations: [],
  
  setDoctors: (doctors) => set({ doctors }),
  setDoctor: (doctor) => {
    const { doctorMapById } = get();
    doctorMapById[doctor.id] = doctor;
    set({ doctorMapById });
  },
  setSpecializations: (specializations) => set({ specializations }),
})); 