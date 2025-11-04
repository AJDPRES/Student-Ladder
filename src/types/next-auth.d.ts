import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: NonNullable<Session['user']> & {
      id?: string;
      role?: string;
      isAdmin?: boolean;
    };
  }

  interface User {
    role?: string;
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    isAdmin?: boolean;
  }
}
