import Link from "next/link";

import styles from "@/components/ServiceCards.module.css";

interface ServiceCard {
  label: string;
  href: string;
  summary: string;
}

interface ServiceCardsProps {
  items: ServiceCard[];
}

const eventTypesTop = [
  { title: "Corporate", description: "Ensure your corporate event has something your staff will talk about.", glyph: "◈" },
  { title: "Brand Activation", description: "Launches and activations designed for premium guest engagement.", glyph: "◎" },
  { title: "Birthdays", description: "Celebrate with immersive videos your guests can instantly share.", glyph: "✦" }
];

const eventTypesBottom = [
  { title: "Weddings", description: "Allow your guests to feel like superstars on your wedding day.", glyph: "◌" },
  { title: "Engagements", description: "Break the ice and create timeless memories with cinematic capture.", glyph: "◇" },
  { title: "Parties", description: "Make every party unforgettable with ONE360 video experiences.", glyph: "✧" }
];

const featureImages = [
  "https://one360.com.au/wp-content/uploads/2025/08/GlamBot-Hire-Sydney.jpg",
  "https://one360.com.au/wp-content/uploads/2024/10/360-Photo-Video-Booth-Hire-Sephora-Event-4-pkiy521dfsi0jbzghampey09nern8ag62l36nryhq8.jpeg"
];

export function ServiceCards({ items }: ServiceCardsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          The Next Level <span>Video Experience</span> for Every Event.
        </h2>
        <p className={styles.lead}>
          Elevate every moment with ONE360&rsquo;s cinematic video booth and GlamBot experiences.
          Capture, share, and relive your event instantly.
        </p>
      </div>

      <div className={styles.linkGrid}>
        {items.map((item) => (
          <Link href={item.href} className={styles.serviceCard} key={`${item.label}-${item.href}`}>
            <h3 className={styles.cardTitle}>{item.label}</h3>
            <p className={styles.cardMeta}>{item.summary}</p>
          </Link>
        ))}
      </div>

      <div className={styles.eventGrid}>
        {eventTypesTop.map((item) => (
          <article className={styles.eventCard} key={item.title}>
            <p className={styles.glyph}>{item.glyph}</p>
            <h3 className={styles.eventTitle}>{item.title}</h3>
            <p className={styles.eventMeta}>{item.description}</p>
          </article>
        ))}
      </div>

      <div className={styles.featureSplit}>
        {featureImages.map((image) => (
          <figure className={styles.featurePanel} key={image}>
            <img src={image} alt="ONE360 event capture" className={styles.featureImage} loading="lazy" />
          </figure>
        ))}
      </div>

      <div className={styles.eventGrid}>
        {eventTypesBottom.map((item) => (
          <article className={styles.eventCard} key={item.title}>
            <p className={styles.glyph}>{item.glyph}</p>
            <h3 className={styles.eventTitle}>{item.title}</h3>
            <p className={styles.eventMeta}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
