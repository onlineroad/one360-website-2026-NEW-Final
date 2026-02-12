import styles from "@/components/SectionBlock.module.css";

interface SectionBlockProps {
  title: string;
  body?: string;
}

export function SectionBlock({ title, body }: SectionBlockProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {body ? <p className={styles.body}>{body}</p> : null}
    </section>
  );
}
