import type { MediaAsset } from "@/types/content";
import styles from "@/components/MediaGallery.module.css";
import { buildCaption, isVideoUrl, uniqueMediaBySource } from "@/utils/page-media";

interface MediaGalleryProps {
  media: MediaAsset[];
  title?: string;
}

export function MediaGallery({ media, title = "Gallery" }: MediaGalleryProps) {
  const images = uniqueMediaBySource(media).filter((asset) => !isVideoUrl(asset.sourceUrl)).slice(0, 16);

  if (images.length === 0) {
    return null;
  }

  const columns = [0, 1, 2, 3].map((column) => images.filter((_, index) => index % 4 === column));

  return (
    <section className={styles.gallery} id="gallery">
      <div className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>Real moments from premium events across Australia.</p>
      </div>

      <div className={styles.masonry}>
        {columns.map((columnAssets, columnIndex) => (
          <div className={`${styles.column} ${styles[`column${columnIndex + 1}`]}`} key={`column-${columnIndex}`}>
            {columnAssets.map((asset) => (
              <figure className={styles.card} key={asset.sourceUrl}>
                <img
                  src={asset.localOriginal ?? asset.sourceUrl}
                  alt={asset.alt || "ONE360 gallery image"}
                  className={styles.image}
                  loading="lazy"
                />
                <figcaption className={styles.caption}>{buildCaption(asset)}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
