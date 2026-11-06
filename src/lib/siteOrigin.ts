// Redirects and emailed links must never derive their authority from request
// Origin/Host headers. Configuration is trusted; callers cannot override it.
export function siteOrigin(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://espositodossantosfoundation.org');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
      (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && local && url.protocol === 'http:'))) {
    throw new Error('Invalid canonical site origin');
  }
  return url.origin;
}

export function safeInternalPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\x00-\x20]|%2f|%5c/i.test(value)) return '/portal';
  const origin = siteOrigin();
  const url = new URL(value, origin);
  return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : '/portal';
}
