import Image from "next/image";
import styles from "./webstudio.module.css";

const WHATSAPP_URL = "https://wa.link/33rwr3";

export default function HeroWebstudio() {
  return (
    <section className={styles.hero} aria-labelledby="webstudio-title">
      <div className={styles.heroShell}>
        <h1 id="webstudio-title" className={styles.title}>
          WEBSTUDIO
        </h1>

        <div className={styles.visualStage} aria-label="Figura 3D de WEBSTUDIO">
          <div className={styles.visualBlock} aria-hidden="true" />
          <div className={styles.figureWrap}>
            <div className={styles.figureMotion}>
              <Image
                className={styles.figure}
                src="/webstudio/webstudio-figure.png"
                alt=""
                width={1339}
                height={611}
                priority
                sizes="(max-width: 700px) 96vw, (max-width: 1100px) 92vw, 1050px"
              />
            </div>
          </div>
        </div>

        <div className={styles.heroFooter}>
          <div className={styles.support}>
            <span>Con el apoyo de</span>
            <Image
              className={styles.likeliLogo}
              src="/logos/likeli/likeli-black-transparent.png"
              alt="Likeli"
              width={74}
              height={24}
              sizes="74px"
            />
          </div>

          <a
            className={styles.whatsappButton}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
