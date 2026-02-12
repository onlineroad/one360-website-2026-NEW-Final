"use client";

import { useEffect } from "react";

import styles from "@/components/HubspotFormEmbed.module.css";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
        }) => void;
      };
    };
  }
}

const portalId = "20932730";
const formId = "4f4fe4b3-e524-4305-83d1-767cdcb150c0";

interface HubspotFormEmbedProps {
  targetId?: string;
}

export function HubspotFormEmbed({ targetId = "hubspot-booking-form" }: HubspotFormEmbedProps) {
  useEffect(() => {
    const initForm = () => {
      if (!window.hbspt?.forms) {
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      if (target.childElementCount > 0) {
        return;
      }

      window.hbspt.forms.create({
        region: "na1",
        portalId,
        formId,
        target: `#${targetId}`
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.hsforms.net/forms/shell.js"]'
    );

    if (existingScript) {
      initForm();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/shell.js";
    script.async = true;
    script.onload = initForm;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [targetId]);

  return (
    <section className={styles.section} id="book">
      <div className={styles.card}>
        <p className={styles.note}>Enter your event details below to receive your quote/pricing.</p>
        <div id={targetId} />
      </div>
    </section>
  );
}
