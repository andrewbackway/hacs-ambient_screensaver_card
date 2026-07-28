/**
 * Slow, subtle periodic translate() of the overlay layer, so text doesn't
 * sit at the exact same pixels for hours at a time (OLED/panel burn-in
 * mitigation - see custom-card-plan.md §7).
 */
export class PixelShiftController {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private positionIndex = 0;

  // 8 positions around a small circle, in units of the configured distance.
  private static readonly OFFSETS: Array<[number, number]> = [
    [1, 0],
    [0.7, 0.7],
    [0, 1],
    [-0.7, 0.7],
    [-1, 0],
    [-0.7, -0.7],
    [0, -1],
    [0.7, -0.7],
  ];

  start(
    distancePx: number,
    periodSeconds: number,
    onOffset: (dx: number, dy: number) => void
  ): void {
    this.stop();
    onOffset(0, 0);
    this.intervalId = setInterval(() => {
      this.positionIndex =
        (this.positionIndex + 1) % PixelShiftController.OFFSETS.length;
      const [ux, uy] = PixelShiftController.OFFSETS[this.positionIndex];
      onOffset(ux * distancePx, uy * distancePx);
    }, Math.max(1, periodSeconds) * 1000);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
