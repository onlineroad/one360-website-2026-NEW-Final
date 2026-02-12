"use client";

import { useEffect, useMemo, useState } from "react";
import type { Testimonial } from "@/types/content";
import styles from "@/components/Testimonials.module.css";

interface TestimonialsProps {
  items: Testimonial[];
}

export function Testimonials({ items }: TestimonialsProps) {
  const slides = useMemo(() => items.slice(0, 8), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>What Our Customers Say</h2>

      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((item, index) => (
            <article className={styles.card} key={`${item.quote}-${index}`}>
              <p className={styles.quote}>{item.quote}</p>
              {item.author ? <p className={styles.author}>- {item.author}</p> : null}
            </article>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className={styles.controls}>
          <button
            type="button"
            onClick={goToPrevious}
            className={styles.controlButton}
            aria-label="Previous testimonial"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={goToNext}
            className={styles.controlButton}
            aria-label="Next testimonial"
          >
            Next
          </button>
        </div>
      ) : null}

      {slides.length > 1 ? (
        <div className={styles.dots}>
          {slides.map((item, index) => (
            <button
              type="button"
              key={`${item.quote}-${index}-dot`}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
