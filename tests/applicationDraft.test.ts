import { describe, expect, it } from 'vitest';
import { draftFields, draftKey, readDraft } from '../src/lib/applicationDraft';
describe('application drafts', () => {
  it('keeps application kinds separate', () => {
    expect(draftKey('volunteer')).not.toBe(draftKey('scholarship'));
    expect(draftFields('volunteer', { name: 'Ana', program: 'music', interest: 'music' })).toEqual({ name: 'Ana', interest: 'music' });
  });
  it('never restores honeypot, consent, or arbitrary data', () => {
    expect(draftFields('scholarship', { company: 'bot', consent: true, message: 'hello', name: 4 })).toEqual({ message: 'hello' });
    expect(draftFields('volunteer', [])).toEqual({});
  });
  it('restores saved text, handles absence, rejects corrupt storage', () => {
    expect(readDraft({ getItem: () => '{"name":"Ana"}' }, 'volunteer')).toEqual({ name: 'Ana' });
    expect(readDraft({ getItem: () => null }, 'volunteer')).toEqual({});
    expect(() => readDraft({ getItem: () => '{' }, 'volunteer')).toThrow();
    expect(() => readDraft({ getItem: () => { throw Error('blocked'); } }, 'volunteer')).toThrow();
  });
});
