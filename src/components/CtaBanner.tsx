import Link from "next/link";

import styles from "@/components/CtaBanner.module.css";

interface CtaBannerProps {
  text?: string;
  href?: string;
}

export function CtaBanner({ text = "Book Now | Make your events memorable", href = "/book/" }: CtaBannerProps) {
  return (
    <section className={styles.banner}>
      <div className={styles.inner}>
        <p className={styles.text}>{text}</p>
        <Link href={href} className={styles.button}>
          Book Now
        </Link>
      </div>
    </section>
  );
}
