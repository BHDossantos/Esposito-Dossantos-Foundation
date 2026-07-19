import { describe, it, expect } from 'vitest';
import {
  applicationSchema,
  contactSchema,
  newsletterSchema,
  rsvpSchema
} from '@/lib/leads';

describe('newsletterSchema', () => {
  it('accepts a valid subscription', () => {
    expect(newsletterSchema.safeParse({ name: 'A', email: 'a@b.com', interest: 'donor' }).success).toBe(true);
  });
  it('rejects a bad email and empty name', () => {
    expect(newsletterSchema.safeParse({ name: '', email: 'nope' }).success).toBe(false);
  });
});

describe('contactSchema', () => {
  it('accepts a valid message', () => {
    expect(
      contactSchema.safeParse({ name: 'A', email: 'a@b.com', inquiryType: 'general', message: 'Hi' }).success
    ).toBe(true);
  });
  it('requires a message', () => {
    expect(contactSchema.safeParse({ name: 'A', email: 'a@b.com', inquiryType: 'general' }).success).toBe(false);
  });
  it('accepts the honeypot field (checked in the route, not the schema)', () => {
    const r = contactSchema.safeParse({
      name: 'A',
      email: 'a@b.com',
      inquiryType: 'general',
      message: 'Hi',
      company: 'spam'
    });
    expect(r.success).toBe(true);
  });
});

describe('applicationSchema', () => {
  it('accepts a volunteer application', () => {
    expect(
      applicationSchema.safeParse({ type: 'volunteer', name: 'A', email: 'a@b.com', message: 'Help' }).success
    ).toBe(true);
  });
  it('rejects an unknown application type', () => {
    expect(
      applicationSchema.safeParse({ type: 'other', name: 'A', email: 'a@b.com', message: 'x' }).success
    ).toBe(false);
  });
});

describe('rsvpSchema', () => {
  it('coerces guests to an integer within range', () => {
    const r = rsvpSchema.safeParse({ name: 'A', email: 'a@b.com', guests: '3', eventSlug: 'gala' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.guests).toBe(3);
  });
  it('rejects guests above the max', () => {
    expect(rsvpSchema.safeParse({ name: 'A', email: 'a@b.com', guests: 99, eventSlug: 'gala' }).success).toBe(false);
  });
  it('requires an event slug', () => {
    expect(rsvpSchema.safeParse({ name: 'A', email: 'a@b.com' }).success).toBe(false);
  });
});
