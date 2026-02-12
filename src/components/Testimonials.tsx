import type { Testimonial } from "@/types/content";
import styles from "@/components/Testimonials.module.css";

interface TestimonialsProps {
  items: Testimonial[];
}

export function Testimonials({ items }: TestimonialsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>What Our Customers Say</h2>
      <div className={styles.grid}>
        {items.slice(0, 6).map((item, index) => (
          <article className={styles.card} key={`${item.quote}-${index}`}>
            <p className={styles.quote}>{item.quote}</p>
            {item.author ? <p className={styles.author}>- {item.author}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
