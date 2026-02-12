import Link from "next/link";

import styles from "@/components/Hero.module.css";

interface HeroProps {
  title: string;
  eyebrow?: string;
  intro?: string;
  videoUrl?: string;
  isServicePage?: boolean;
}

export function Hero({ title, eyebrow, intro, videoUrl, isServicePage = false }: HeroProps) {
  return (
    <section className={styles.hero}>
      {videoUrl ? (
        <video className={styles.video} autoPlay muted loop playsInline preload="metadata">
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : null}
      <div className={styles.overlay} />
      <div className={styles.glowOrb} />

      <div className={styles.inner}>
        <div className={styles.content}>
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

        <div className={styles.metaCard}>
          <p className={styles.metaTitle}>{isServicePage ? "Service Experience" : "Event Experience"}</p>
          <ul className={styles.metaList}>
            <li>4K capture with cinematic slow motion.</li>
            <li>Instant sharing via QR, AirDrop, or email.</li>
            <li>Sydney, Melbourne, and Brisbane coverage.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
