import type { ReactNode } from 'react';

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return <div className="page page--admin">{children}</div>;
}
