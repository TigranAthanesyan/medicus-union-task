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
