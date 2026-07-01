"use client";

import HeroWebstudio from "./HeroWebstudio";
import styles from "./webstudio.module.css";

export default function WebstudioLanding() {
  return (
    <main className={styles.root}>
      <HeroWebstudio />
      <section className={styles.scrollProbe} aria-hidden="true" />
    </main>
  );
}
