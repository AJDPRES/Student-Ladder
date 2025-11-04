import NextAuth from 'next-auth';
import type { NextAuthConfig, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { prisma, prismaReady } from '@/lib/prisma';
import { ensureAuthSecretForRuntime } from '@/lib/env';

const { secret: authSecret } = ensureAuthSecretForRuntime();

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: authSecret,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT & { id?: string; role?: string; isAdmin?: boolean };
      user?: { id?: string | null; role?: string | null; isAdmin?: boolean } | null;
    }) {
      if (user?.id) {
        token.id = user.id;
      }

      if (user?.role) {
        token.role = user.role;
      }
      if (typeof user?.isAdmin === 'boolean') {
        token.isAdmin = user.isAdmin;
      }

      const subject = (token as { sub?: unknown }).sub;
      if (typeof subject === 'string' && !token.id) {
        token.id = subject;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session & { user: Session['user'] & { role?: string; isAdmin?: boolean } };
      token: JWT & { id?: string; role?: string; isAdmin?: boolean };
    }) {
      if (session.user && token?.id) {
        session.user.id = String(token.id);
      }
      if (session.user && token?.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.isAdmin = Boolean(token?.isAdmin);
      }

      return session;
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        portal: { label: 'Portal', type: 'text' },
      },
      async authorize(credentials) {
        await prismaReady();
        const email = typeof credentials?.email === 'string' ? credentials.email.trim() : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        const portal = (typeof credentials?.portal === 'string' ? credentials.portal : 'student').toLowerCase();

        if (!email || !password) {
          return null;
        }

        const normalizedEmail = email.toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: { id: true, email: true, passwordHash: true, role: true, isAdmin: true, name: true, emailVerified: true },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const bcrypt = await import('bcryptjs');
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        const roleFromDb = user.role ?? 'STUDENT';
        const normalizedRole = roleFromDb === 'EMPLOYER' ? 'EMPLOYER' : 'STUDENT';

        if (process.env.REQUIRE_VERIFIED_EMAIL === 'true' && !user.emailVerified) {
          return null;
        }

        const isStudentPortal = portal === 'student';
        const isEmployerPortal = portal === 'employer';
        const isAdminPortal = portal === 'admin';

        if (isStudentPortal && normalizedRole !== 'STUDENT') {
          throw new Error('PORTAL_MISMATCH');
        }
        if (isEmployerPortal && normalizedRole !== 'EMPLOYER') {
          throw new Error('PORTAL_MISMATCH');
        }
        if (isAdminPortal && !user.isAdmin) {
          throw new Error('PORTAL_MISMATCH');
        }

        return {
          id: user.id,
          email: user.email ?? normalizedEmail,
          name: user.name ?? undefined,
          role: normalizedRole,
          isAdmin: user.isAdmin,
        } as { id: string; email?: string; name?: string; role: string; isAdmin: boolean };
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const { GET, POST } = handlers;
