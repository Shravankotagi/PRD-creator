// lib/ratelimit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 h'),
  analytics: true,
  prefix: 'tech-stack-auditor',
});

export function getRateLimitIdentifier(
  req: NextRequest
): string {
  const forwardedFor = req.headers.get(
    'x-forwarded-for'
  );

  const realIp = req.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'anonymous';
}