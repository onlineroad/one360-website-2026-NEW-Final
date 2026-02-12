import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ maxWidth: 840, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ margin: 0 }}>Page not found</h1>
      <p>The page you requested is not available.</p>
      <p>
        <Link href="/">Go home</Link> or <Link href="/book/">book now</Link>.
      </p>
    </section>
  );
}
