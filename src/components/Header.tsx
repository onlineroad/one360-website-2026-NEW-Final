"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { SiteConfig } from "@/types/content";
import styles from "@/components/Header.module.css";

interface HeaderProps {
  site: SiteConfig;
}

function NavLink({
  href,
  label,
  isCta,
  className
}: {
  href: string;
  label: string;
  isCta?: boolean;
  className?: string;
}) {
  const mergedClassName = [styles.link, isCta ? styles.cta : "", className || ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={mergedClassName}>
      {label}
    </Link>
  );
}

export function Header({ site }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <Image
            src={site.logo}
            alt={site.siteName}
            width={548}
            height={308}
            className={styles.logo}
            priority
          />
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          Menu
        </button>

        <nav className={styles.nav} aria-label="Primary navigation">
          <ul className={styles.menu}>
            {site.nav.map((item) => (
              <li className={styles.item} key={`${item.label}-${item.href}`}>
                <NavLink href={item.href} label={item.label} isCta={item.isCta} />
                {item.children && item.children.length > 0 ? (
                  <ul className={styles.dropdown}>
                    {item.children.map((child) => (
                      <li key={`${child.label}-${child.href}`}>
                        <Link href={child.href}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {mobileOpen ? (
        <nav id="mobile-nav" className={styles.mobileNav} aria-label="Mobile navigation">
          <ul className={styles.mobileList}>
            {site.nav.map((item) => (
              <li key={`m-${item.label}-${item.href}`}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  isCta={item.isCta}
                  className={styles.mobileLink}
                />
                {item.children && item.children.length > 0 ? (
                  <ul className={styles.mobileSubmenu}>
                    {item.children.map((child) => (
                      <li key={`m-${child.label}-${child.href}`}>
                        <Link href={child.href} className={styles.mobileLink}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
