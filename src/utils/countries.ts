import { Country } from '../types/global';
import { UserDTO } from '../types/api';
import { COUNTRIES } from '../constants/countries';

export const getCountryName = (countryCode: string): string => {
  if (!countryCode) return '';
  
  const country = COUNTRIES.find(c => c.value === countryCode.toUpperCase());
  return country ? country.label : countryCode;
}; 

export const getCountryFlagUrl = (countryCode: string): string => {
  if (!countryCode) return '';
  
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

export const getAvailableCountries = (doctors: UserDTO[]): Country[] => {
  const uniqueCountryCodes = [...new Set(
    doctors
      .map(doctor => doctor.country)
      .filter(Boolean)
  )] as string[];

  return uniqueCountryCodes
    .map(countryCode => {
      const country = COUNTRIES.find(c => c.value === countryCode);
      return country ? 
        { value: country.value, label: country.label } : 
        { value: countryCode, label: countryCode };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
};
