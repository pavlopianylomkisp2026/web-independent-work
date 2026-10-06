import { NextResponse, type NextRequest } from 'next/server';
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-studyhub-language', /^\/en(?:\/|$)/.test(request.nextUrl.pathname) ? 'en' : 'uk');
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/((?!api|_next|favicon.ico).*)'] };
