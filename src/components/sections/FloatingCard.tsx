import clsx from "clsx";
import styles from "./FloatingCard.module.css";

const BASE_WIDTH = 182;
const BASE_HEIGHT = 168;

type FloatingCardProps = {
  title: string;
  logo: string;
  top: number;
  left?: number;
  right?: number;
  scale?: number;
  blur?: number;
  floatDelay?: number;
  floatDuration?: number;
  floatDistance?: number;
};

export default function FloatingCard({
  title,
  logo,
  top,
  left,
  right,
  scale = 1,
  blur = 0,
  floatDelay,
  floatDuration,
  floatDistance,
}: FloatingCardProps) {
  const width = BASE_WIDTH * scale;
  const height = BASE_HEIGHT * scale;
  const opacity = Math.max(0.75, Math.min(1, scale));
  const zIndex = Math.round(scale * 1000);
  const fontSize = 14 * scale;
  const artHeight = 100 * scale;
  const padding = 16 * scale;
  const gap = 16 * scale;
  const cardRadius = 8 * scale;
  const frameInset = 4 * scale;
  const frameBorder = Math.max(0.75, 1 * scale);
  const distance = floatDistance ?? Math.max(6, 12 * (1 - scale) * 1.2);
  const horizontal = (Math.random() - 0.5) * distance * 0.8;
  const duration = floatDuration ?? (7 + (1 - scale) * 4);
  const delay = floatDelay ?? -(Math.random() * duration);

  return (
    <div
      className={styles.card}
      style={{
        top,
        left,
        right,
        width,
        height,
        filter: blur ? `blur(${blur}px)` : undefined,
        zIndex,
        // @ts-expect-error CSS custom property
        '--card-opacity': opacity,
        '--card-font-size': `${fontSize}px`,
        '--art-height': `${artHeight}px`,
        '--card-padding': `${padding}px`,
        '--card-gap': `${gap}px`,
        '--card-radius': `${cardRadius}px`,
        '--frame-inset': `${frameInset}px`,
        '--frame-border': `${frameBorder}px`,
        '--float-distance': `${distance}px`,
        '--float-horizontal': `${horizontal}px`,
        '--float-duration': `${duration}s`,
        '--float-delay': `${delay}s`,
      }}
    >
      <div className={styles.cardInner}>
        <div className={styles.art}>
          <div className={styles.logoFrame}>
            <img src={logo} alt={title} className={styles.logo} />
          </div>
        </div>
        <div className={clsx(styles.title)}>{title}</div>
      </div>
    </div>
  );
}
