import Image from "next/image";
import Link from "next/link";

import type { SiteConfig } from "@/types/content";
import styles from "@/components/Footer.module.css";

interface FooterProps {
  site: SiteConfig;
}

export function Footer({ site }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandRow}>
          <Link href="/">
            <Image src={site.logo} alt={site.siteName} width={548} height={308} className={styles.logo} />
          </Link>
        </div>

        <p className={styles.description}>{site.footerDescription}</p>
        <p className={styles.locations}>{site.contact.locationsLine}</p>
        <p className={styles.contact}>
          <strong>Phone:</strong> <a href={site.contact.phoneRaw}>{site.contact.phoneDisplay}</a>
          <br />
          <strong>Email:</strong> <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
        </p>
        <p className={styles.cta}>
          <Link href="/book/">Book Now</Link> | Make your events memorable
        </p>

        <ul className={styles.socials}>
          {site.socials.map((social) => (
            <li key={social.href}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                {social.label}
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.copyright}>Copyright 2024 © All Right Reserved. Designed by Online Road</p>
      </div>
    </footer>
  );
}
