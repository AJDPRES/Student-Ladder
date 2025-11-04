import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page page--public">
      <div className="not-found">
        <h1 className="page-title">Page not found</h1>
        <p>That page has climbed off the Student Ladder. Head back to the homepage to keep exploring.</p>
        <Link className="chip" href="/">Return home</Link>
      </div>
    </main>
  );
}
