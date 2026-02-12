import type { FaqItem } from "@/types/content";
import styles from "@/components/FaqAccordion.module.css";

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} id="faqs">
      <div className={styles.inner}>
        <h2 className={styles.title}>FAQs.</h2>
        {items.map((item) => (
          <details className={styles.item} key={item.question}>
            <summary className={styles.summary}>{item.question}</summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
