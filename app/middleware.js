import { NextResponse } from 'next/server';

export function middleware(req) {
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'https://expences-management.vercel.app',
    
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse('CORS policy error মিজাুনর : Not allowed', { status: 403 });
  }

  return NextResponse.next();
}
