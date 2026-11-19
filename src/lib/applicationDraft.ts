export type ApplicationKind = 'volunteer' | 'scholarship';
const common = ['name', 'email', 'country', 'message'];
export const draftKey = (kind: ApplicationKind) => 'foundation:application-draft:' + kind;
export function draftFields(kind: ApplicationKind, value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const allowed = [...common, ...(kind === 'volunteer' ? ['interest', 'availability'] : ['program', 'institution'])];
  return Object.fromEntries(allowed.flatMap((key) => {
    const text = (value as Record<string, unknown>)[key];
    return typeof text === 'string' && text.length <= 20000 ? [[key, text]] : [];
  }));
}
export function readDraft(storage: Pick<Storage, 'getItem'>, kind: ApplicationKind) {
  return draftFields(kind, JSON.parse(storage.getItem(draftKey(kind)) || '{}'));
}
