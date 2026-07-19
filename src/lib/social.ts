// Social profiles are read from server-side environment variables so the site
// only ever links to real, configured accounts. Until a URL is set, nothing is
// rendered and the profile is omitted from the Organization schema `sameAs` —
// we never advertise a profile that does not exist.
export type SocialLink = { key: string; label: string; url: string };

const definitions: Array<{ key: string; label: string; env: string }> = [
  { key: 'instagram', label: 'Instagram', env: 'SOCIAL_INSTAGRAM_URL' },
  { key: 'linkedin', label: 'LinkedIn', env: 'SOCIAL_LINKEDIN_URL' },
  { key: 'youtube', label: 'YouTube', env: 'SOCIAL_YOUTUBE_URL' },
  { key: 'facebook', label: 'Facebook', env: 'SOCIAL_FACEBOOK_URL' },
  { key: 'x', label: 'X', env: 'SOCIAL_X_URL' }
];

export function getSocialLinks(): SocialLink[] {
  return definitions
    .map((d) => ({ key: d.key, label: d.label, url: process.env[d.env]?.trim() ?? '' }))
    .filter((d) => d.url.length > 0);
}
