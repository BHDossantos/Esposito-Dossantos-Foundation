import { expect, it } from 'vitest';
import { contactIntent, inquiryTypes } from '../src/lib/contactIntent';
it('prefills only supported inquiry types, rejecting repeated or unknown query values', () => {
 for (const value of inquiryTypes) expect(contactIntent(value)).toBe(value);
 for (const value of [undefined, null, ['media'], 'constructor', '<script>', 'unknown']) expect(contactIntent(value)).toBe('general');
});
