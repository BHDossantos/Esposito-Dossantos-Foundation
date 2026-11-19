export const inquiryTypes = ['general', 'donation', 'partnership', 'volunteer', 'media', 'grant'] as const;
export function contactIntent(value: unknown): typeof inquiryTypes[number] {
  return typeof value === 'string' && inquiryTypes.includes(value as typeof inquiryTypes[number]) ? value as typeof inquiryTypes[number] : 'general';
}
