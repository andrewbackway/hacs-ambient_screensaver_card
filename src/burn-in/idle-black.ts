export type IdleState = "active" | "dimmed" | "black";

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "pointerdown",
  "pointermove",
  "touchstart",
  "keydown",
];

/**
 * Fully self-contained idle tracking (replaces WallPanel's idle engine -
 * see custom-card-plan.md §4/§7). Listens for user activity on `window`
 * and reports the current idle state so the card can dim, then fade to
 * true black, after configurable periods of inactivity. Any activity
 * immediately resets back to `active`.
 */
export class IdleController {
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private blackTimer: ReturnType<typeof setTimeout> | null = null;
  private listening = false;
  private handler = () => this.reset();

  start(
    idleSeconds: number,
    blackSeconds: number,
    onStateChange: (state: IdleState) => void
  ): void {
    this.stop();
    this.onStateChange = onStateChange;
    this.idleSeconds = idleSeconds;
    this.blackSeconds = blackSeconds;

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, this.handler, { passive: true });
    }
    this.listening = true;
    this.scheduleTimers();
  }

  stop(): void {
    if (this.listening) {
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, this.handler);
      }
      this.listening = false;
    }
    this.clearTimers();
  }

  private onStateChange: (state: IdleState) => void = () => {};
  private idleSeconds = 120;
  private blackSeconds = 600;

  private reset(): void {
    this.onStateChange("active");
    this.scheduleTimers();
  }

  private scheduleTimers(): void {
    this.clearTimers();
    this.idleTimer = setTimeout(() => {
      this.onStateChange("dimmed");
    }, Math.max(1, this.idleSeconds) * 1000);

    this.blackTimer = setTimeout(() => {
      this.onStateChange("black");
    }, Math.max(this.idleSeconds + 1, this.blackSeconds) * 1000);
  }

  private clearTimers(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.blackTimer !== null) {
      clearTimeout(this.blackTimer);
      this.blackTimer = null;
    }
  }
}
