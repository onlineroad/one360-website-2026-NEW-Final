import Link from "next/link";

import styles from "@/components/RedirectNotice.module.css";

interface RedirectNoticeProps {
  destination: string;
  title?: string;
}

export function RedirectNotice({ destination, title = "This page has moved" }: RedirectNoticeProps) {
  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>
          This URL is no longer active. Continue to <Link href={destination} className={styles.link}>{destination}</Link>.
        </p>
      </div>
    </section>
  );
}
