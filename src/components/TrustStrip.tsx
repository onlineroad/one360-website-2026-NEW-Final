import type { MediaAsset } from "@/types/content";
import styles from "@/components/TrustStrip.module.css";
import { buildCaption, isBrandLogoAsset, isEventCaptureAsset, uniqueMediaBySource } from "@/utils/page-media";

interface TrustStripProps {
  media: MediaAsset[];
}

const fallbackBrands: MediaAsset[] = [
  { sourceUrl: "https://one360.com.au/wp-content/uploads/2024/11/1-edited.png", alt: "Foxtel" },
  { sourceUrl: "https://one360.com.au/wp-content/uploads/2024/11/2-edited-1.png", alt: "American Express" },
  { sourceUrl: "https://one360.com.au/wp-content/uploads/2024/11/3-edited.png", alt: "Microsoft" },
  { sourceUrl: "https://one360.com.au/wp-content/uploads/2024/11/4-edited.png", alt: "Samsung" },
  { sourceUrl: "https://one360.com.au/wp-content/uploads/2024/11/5-edited.png", alt: "Sephora" },
  { sourceUrl: "https://one360.com.au/wp-content/uploads/2024/11/6-edited-1.png", alt: "Instagram" }
];

const fallbackCaptures: MediaAsset[] = [
  {
    sourceUrl: "https://one360.com.au/wp-content/uploads/2025/08/360-Video-Booth-Hire-Sydney-and-Melbourne-JAECOO-1.jpg",
    alt: "JAECOO - 360 Video Booth Hire Sydney and Melbourne"
  },
  {
    sourceUrl: "https://one360.com.au/wp-content/uploads/2025/08/ACRA-AWARDS-360-Video-Booth-Hire-Custom-1.jpg",
    alt: "ACRA Awards - 360 Video Booth Hire Sydney and Melbourne"
  },
  {
    sourceUrl: "https://one360.com.au/wp-content/uploads/2025/08/360-Photo-Booth-Hire-Sydney-SAMSUNG.jpg",
    alt: "Samsung Event - 360 Photo Booth Hire Sydney"
  },
  {
    sourceUrl: "https://one360.com.au/wp-content/uploads/2025/08/Camellia-X-ONE360-Photo-Booth-Hire-Sydney.jpg",
    alt: "Camellia HQ - Sydney Photo Booth"
  },
  {
    sourceUrl: "https://one360.com.au/wp-content/uploads/2025/08/360-Video-Booth-Hire-Sydney-and-Melbourne-Elvis-Premiere.jpg",
    alt: "Elvis Premiere - 360 Video Booth Hire"
  },
  {
    sourceUrl: "https://one360.com.au/wp-content/uploads/2025/08/Doltone-House-Event-360-Photo-Booth-Hire-Sydney.jpg",
    alt: "Doltone House Event - 360 Photo Booth Hire Sydney"
  }
];

function repeatForLoop<T>(items: T[]): T[] {
  if (items.length === 0) {
    return [];
  }
  return [...items, ...items];
}

export function TrustStrip({ media }: TrustStripProps) {
  const logos = uniqueMediaBySource([...media.filter(isBrandLogoAsset), ...fallbackBrands]).slice(0, 12);
  const captures = uniqueMediaBySource([...media.filter(isEventCaptureAsset), ...fallbackCaptures]).slice(0, 12);

  if (logos.length === 0 && captures.length === 0) {
    return null;
  }

  const loopedLogos = repeatForLoop(logos);
  const loopedCaptures = repeatForLoop(captures);

  return (
    <section className={styles.section} aria-label="Brand and Event Highlights">
      <div className={styles.inner}>
        {logos.length > 0 ? (
          <div className={styles.block}>
            <p className={styles.label}>Brands We Have Worked With</p>
            <div className={styles.logoMarquee}>
              <div className={styles.logoTrack}>
                {loopedLogos.map((logo, index) => (
                  <figure className={styles.logoItem} key={`${logo.sourceUrl}-${index}`}>
                    <img src={logo.sourceUrl} alt={logo.alt || "ONE360 Client"} className={styles.logo} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {captures.length > 0 ? (
          <div className={styles.block}>
            <p className={styles.label}>Recent Setup Captures</p>
            <div className={styles.captureMarquee}>
              <div className={styles.captureTrack}>
                {loopedCaptures.map((item, index) => (
                  <figure className={styles.captureCard} key={`${item.sourceUrl}-${index}`}>
                    <img src={item.sourceUrl} alt={item.alt || "Event Setup"} className={styles.captureImage} loading="lazy" />
                    <figcaption className={styles.captureCaption}>{buildCaption(item)}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
