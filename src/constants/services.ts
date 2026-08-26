import type { IconName } from '@/components/Icon';
import type { ServiceType } from '@/lib/api';

export const ACTIVE_SERVICES: ServiceType[] = [
  'ELECTRICITY',
  'AIRTIME',
  'DATA',
  'TV',
  'WAEC',
  'JAMB',
  'NECO',
];

export const SERVICE_NAMES: Record<ServiceType, string> = {
  ELECTRICITY: 'Electricity',
  AIRTIME: 'Airtime',
  DATA: 'Data',
  TV: 'TV',
  WAEC: 'WAEC',
  JAMB: 'JAMB',
  NECO: 'NECO',
};

export const SERVICE_META: Record<ServiceType, { icon: IconName; color: string }> = {
  ELECTRICITY: { icon: 'flash', color: '#FFB020' },
  AIRTIME: { icon: 'phone-portrait', color: '#4DABF7' },
  DATA: { icon: 'wifi', color: '#9BB8F5' },
  TV: { icon: 'tv', color: '#B8B0F2' },
  WAEC: { icon: 'school', color: '#2ECC71' },
  JAMB: { icon: 'book', color: '#FF7B72' },
  NECO: { icon: 'ribbon', color: '#F78FB3' },
};

export const SUBJECTS: Record<'WAEC' | 'JAMB' | 'NECO', string[]> = {
  WAEC: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Geography',
    'Government',
    'Literature in English',
    'Agricultural Science',
    'Further Mathematics',
  ],
  JAMB: [
    'Use of English',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Geography',
    'Government',
    'Literature in English',
    'Accounting',
    'Commerce',
  ],
  NECO: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Geography',
    'Government',
    'Literature in English',
    'Agricultural Science',
  ],
};

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

export function isRegistrationService(service: ServiceType): boolean {
  return service === 'WAEC' || service === 'JAMB' || service === 'NECO';
}