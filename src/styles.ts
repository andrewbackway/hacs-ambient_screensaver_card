import { css } from "lit";

/**
 * All card styling lives here, injected via LitElement's Shadow DOM -
 * naturally isolated from Home Assistant's card chrome/theming and immune
 * to Lovelace's DOMPurify sanitizing (which only applies to markdown-style
 * cards), per custom-card-plan.md §4/§7. No card background, border, or
 * box-shadow is ever applied - text sits directly on the photo.
 *
 * Dynamic, per-config values (font sizes, text-shadow, opacity, pixel-shift
 * offsets) are supplied as CSS custom properties set on the host element in
 * ambient-screensaver-card.ts; the fallback values below only apply if a
 * property is somehow unset.
 */
export const styles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    --asc-shift-x: 0px;
    --asc-shift-y: 0px;
  }

  .photo-layer {
    position: absolute;
    inset: 0;
  }

  .photo {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity var(--asc-crossfade-time, 2s) ease-in-out;
  }

  .photo.cover {
    background-size: cover;
  }

  .photo.contain {
    background-size: contain;
  }

  .photo.visible {
    opacity: var(--asc-dim-opacity, 1);
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    padding: 2.5vh 2.5vw;
    box-sizing: border-box;
    pointer-events: none;
    color: #fff;
    transform: translate(var(--asc-shift-x), var(--asc-shift-y));
    transition: transform 3s ease-in-out, opacity 1s ease-in-out;
    opacity: var(--asc-dim-opacity, 1);
  }

  .bottom-left {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-self: start;
    align-self: end;
    gap: 0.2em;
  }

  .bottom-right {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-self: end;
    align-self: end;
    text-align: right;
    gap: 0.2em;
  }

  .clock {
    font-size: var(--asc-clock-font-size, clamp(3.5rem, 9vw, 6rem));
    font-weight: 500;
    line-height: 1;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .weather-row {
    display: flex;
    align-items: center;
    gap: 0.3em;
    font-size: var(--asc-weather-font-size, clamp(1.2rem, 3vw, 2rem));
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .weather-row ha-icon {
    --mdc-icon-size: 1.1em;
  }

  .room-row {
    font-size: var(--asc-room-font-size, clamp(0.8rem, 1.8vw, 1.2rem));
    opacity: 0.9;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .location {
    font-size: var(--asc-location-font-size, clamp(1.2rem, 3vw, 2rem));
    font-weight: 500;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .subtitle {
    font-size: var(--asc-subtitle-font-size, clamp(0.8rem, 1.8vw, 1.2rem));
    opacity: 0.9;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .black-curtain {
    position: absolute;
    inset: 0;
    background: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 2s ease-in-out;
  }

  .black-curtain.visible {
    opacity: 1;
  }

  .night-clock {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: clamp(6rem, 20vw, 14rem);
    font-weight: 500;
    line-height: 1;
    opacity: var(--asc-night-clock-opacity, 0.1);
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .night-clock-ampm {
    font-size: 0.3em;
    margin-left: 0.1em;
  }

  .music-view {
    position: absolute;
    inset: 0;
    overflow: hidden;
    color: #fff;
    background: #111;
  }

  .music-background,
  .music-scrim {
    position: absolute;
    inset: -32px;
  }

  .music-background {
    background-image: var(--asc-music-art, none);
    background-position: center;
    background-size: cover;
    filter: blur(28px);
    opacity: 0.8;
    transform: scale(1.08);
  }

  .music-scrim {
    background: rgba(0, 0, 0, 0.58);
  }

  .music-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(180px, 34vw) minmax(0, 1fr);
    grid-template-rows: 1fr auto auto;
    align-items: end;
    gap: 1.5rem 3vw;
    width: min(1100px, 86vw);
    height: 100%;
    margin: 0 auto;
    padding: 7vh 0 8vh;
    box-sizing: border-box;
  }

  .music-cover {
    grid-column: 1;
    grid-row: 1 / span 2;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  }

  .music-cover-empty {
    background: rgba(255, 255, 255, 0.08);
  }

  .music-details {
    grid-column: 2;
    grid-row: 1;
    align-self: end;
    min-width: 0;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
  }

  .music-title {
    font-size: clamp(2rem, 5vw, 5rem);
    font-weight: 600;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }

  .music-artist {
    margin-top: 0.5rem;
    font-size: clamp(1.2rem, 2.5vw, 2.25rem);
  }

  .music-album {
    margin-top: 0.25rem;
    font-size: clamp(0.9rem, 1.5vw, 1.25rem);
    opacity: 0.78;
  }

  .music-controls {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    gap: 0.75rem;
  }

  .music-button {
    display: inline-grid;
    place-items: center;
    width: 3.25rem;
    height: 3.25rem;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: 50%;
    color: #fff;
    background: rgba(0, 0, 0, 0.38);
    cursor: pointer;
  }

  .music-button:hover,
  .music-button:focus-visible {
    background: rgba(255, 255, 255, 0.2);
  }

  .music-button ha-icon {
    --mdc-icon-size: 1.7rem;
  }

  .music-progress {
    grid-column: 1 / -1;
    grid-row: 3;
    width: 100%;
    height: 1.25rem;
    margin: 0;
    appearance: none;
    border-radius: 999px;
    outline: none;
    cursor: pointer;
    background: linear-gradient(
      to right,
      #fff var(--asc-music-progress, 0%),
      rgba(255, 255, 255, 0.3) var(--asc-music-progress, 0%)
    );
  }

  .music-progress::-webkit-slider-thumb {
    width: 0.9rem;
    height: 0.9rem;
    appearance: none;
    border: 0;
    border-radius: 50%;
    background: #fff;
  }

  .music-progress::-moz-range-thumb {
    width: 0.9rem;
    height: 0.9rem;
    border: 0;
    border-radius: 50%;
    background: #fff;
  }

  @media (max-width: 600px) {
    .music-content {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) auto auto auto;
      gap: 1rem;
      width: 84vw;
      padding: 7vh 0 6vh;
    }

    .music-cover {
      grid-column: 1;
      grid-row: 1;
      align-self: center;
      justify-self: center;
      width: min(62vw, 340px);
    }

    .music-details {
      grid-column: 1;
      grid-row: 2;
    }

    .music-controls {
      grid-column: 1;
      grid-row: 3;
    }

    .music-progress {
      grid-column: 1;
      grid-row: 4;
    }
  }

  .debug-overlay {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 10;
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.6);
    color: #0f0;
    font-family: monospace;
    font-size: 0.75rem;
    line-height: 1.4;
    pointer-events: none;
    white-space: nowrap;
  }

  .editor-placeholder {
    padding: 16px;
    font-family: var(--primary-font-family, Roboto);
    font-size: 14px;
    color: var(--primary-text-color);
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 4px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
    margin: 8px;
  }
`;
