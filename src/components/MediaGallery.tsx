import type { MediaAsset } from "@/types/content";
import styles from "@/components/MediaGallery.module.css";

interface MediaGalleryProps {
  media: MediaAsset[];
  title?: string;
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)$/i.test(url);
}

export function MediaGallery({ media, title = "Gallery" }: MediaGalleryProps) {
  if (media.length === 0) {
    return null;
  }

  const unique = Array.from(new Map(media.map((item) => [item.sourceUrl, item])).values()).slice(0, 12);

  return (
    <section className={styles.gallery} id="gallery">
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {unique.map((asset) => (
          <article className={styles.card} key={asset.sourceUrl}>
            {isVideo(asset.sourceUrl) ? (
              <video className={styles.video} controls preload="none">
                <source src={asset.localOriginal ?? asset.sourceUrl} />
              </video>
            ) : (
              <img
                src={asset.localOriginal ?? asset.sourceUrl}
                alt={asset.alt || "ONE360 media"}
                className={styles.image}
                loading="lazy"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
