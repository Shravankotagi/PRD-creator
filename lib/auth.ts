import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { User } from '@/types/session';

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL.trim();
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET || "prd_creator_better_auth_secret_secure_key_2026",
  baseURL: getBaseURL(),
  // Allow requests from both the Vercel production domain and localhost
  // Without this, server-side getSession() rejects the session on Vercel (mobile)
  trustedOrigins: [
    "https://prd-creator-six.vercel.app",
    "http://localhost:3000",
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
  ],
  session: {
    modelName: 'AuthSession',
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  account: {
    modelName: 'Account',
  },
  verification: {
    modelName: 'Verification',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  user: {
    modelName: 'User',
    fields: {
      image: 'avatarUrl',
    }
  }
});

export async function getAuthUser(): Promise<User | null> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) return null;

  return {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    avatarUrl: session.user.image || undefined,
  };
}

export async function syncUserToDB(): Promise<User | null> {
  return getAuthUser();
}

export async function requireAuth(): Promise<User> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getAuthUserId(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return session?.user?.id ?? null;
}