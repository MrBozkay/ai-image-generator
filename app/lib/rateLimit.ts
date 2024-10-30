import { NextResponse } from 'next/server';

const rateLimit = 5; // Number of requests allowed in the time window
const timeWindow = 60 * 1000; // Time window in milliseconds (1 minute)

const ipRequests: { [key: string]: number[] } = {};

export function rateLimiter(ip: string) {
  const now = Date.now();
  const windowStart = now - timeWindow;

  ipRequests[ip] = ipRequests[ip] ? ipRequests[ip].filter(time => time > windowStart) : [];

  if (ipRequests[ip].length >= rateLimit) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  ipRequests[ip].push(now);
  return null;
}