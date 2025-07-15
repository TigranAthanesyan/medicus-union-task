import { Gender } from '../types';

export const GENDER_OPTIONS = [
  { value: Gender.Male, label: 'Male' },
  { value: Gender.Female, label: 'Female' },
] as const;
