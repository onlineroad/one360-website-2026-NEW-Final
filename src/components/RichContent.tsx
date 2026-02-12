import styles from "@/components/RichContent.module.css";
import { transformContentHtml } from "@/utils/html";

interface RichContentProps {
  html: string;
}

export function RichContent({ html }: RichContentProps) {
  const transformed = transformContentHtml(html);

  return (
    <section className={styles.wrapper}>
      <div className={styles.prose} dangerouslySetInnerHTML={{ __html: transformed }} />
    </section>
  );
}
