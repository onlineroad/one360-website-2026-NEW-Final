import Link from "next/link";

import styles from "@/components/Hero.module.css";

interface HeroProps {
  title: string;
  eyebrow?: string;
  intro?: string;
}

export function Hero({ title, eyebrow, intro }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {intro ? <p className={styles.intro}>{intro}</p> : null}
        <div className={styles.ctaRow}>
          <Link href="/book/" className={styles.button}>
            Book Now
          </Link>
          <Link href="/360-video-booth-hire/" className={styles.secondary}>
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
