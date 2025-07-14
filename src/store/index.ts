import { create } from 'zustand';
import { State } from './types';

export const useStore = create<State>((set, get) => ({
  doctors: [],
  doctorMapById: {},
  specializations: [],
  
  setDoctors: (doctors) => set({ doctors }),
  setDoctor: (doctor) => {
    const { doctorMapById } = get();
    set({ 
      doctorMapById: {
        ...doctorMapById,
        [doctor.id]: doctor
      }
    });
  },
  setSpecializations: (specializations) => set({ specializations }),
})); 