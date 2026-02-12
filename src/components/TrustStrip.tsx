import styles from "@/components/TrustStrip.module.css";

const logos = [
  "https://one360.com.au/wp-content/uploads/2024/10/1-1.png",
  "https://one360.com.au/wp-content/uploads/2024/10/2-1.png",
  "https://one360.com.au/wp-content/uploads/2024/10/3-1.png",
  "https://one360.com.au/wp-content/uploads/2024/10/4-1.png",
  "https://one360.com.au/wp-content/uploads/2024/10/5-1.png",
  "https://one360.com.au/wp-content/uploads/2024/10/6-1.png"
];

export function TrustStrip() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Trusted by Leading Brands and Event Teams</h2>
      <p className={styles.quote}>
        "We had One 360 for our wedding this weekend. They were extremely amazing, making all our
        guests laugh and stay entertained."
      </p>
      <div className={styles.logoGrid}>
        {logos.map((logo) => (
          <div key={logo} className={styles.logoCard}>
            <img src={logo} alt="ONE360 client logo" className={styles.logo} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
