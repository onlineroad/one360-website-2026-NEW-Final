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

export function ServiceCards({ items }: ServiceCardsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Services</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <Link href={item.href} className={styles.card} key={`${item.label}-${item.href}`}>
            <h3 className={styles.cardTitle}>{item.label}</h3>
            <p className={styles.cardMeta}>{item.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
