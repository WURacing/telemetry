import { SciChartSurface, SciChartVerticalGroup, NumberRange, VisibleRangeChangedArgs } from "scichart";

interface SurfaceRegistration {
  handler?: (args?: VisibleRangeChangedArgs) => void;
}

class ChartSyncService {
  private readonly verticalGroup = new SciChartVerticalGroup();
  private readonly surfaces = new Map<SciChartSurface, SurfaceRegistration>();
  private suppressBroadcast = false;
  private lastSyncedRange?: NumberRange;

  readonly modifierGroupId = "telemetry-sync-group";

  register(surface: SciChartSurface): void {
    if (this.surfaces.has(surface)) {
      return;
    }

    const registration: SurfaceRegistration = {};
    this.surfaces.set(surface, registration);
    this.verticalGroup.addSurfaceToGroup(surface);

    const axis = surface.xAxes.get(0);
    if (!axis) {
      return;
    }

    if (this.lastSyncedRange) {
      axis.visibleRange = this.createRangeClone(this.lastSyncedRange);
    }

    const handler = (args?: VisibleRangeChangedArgs) => {
      if (!args || this.suppressBroadcast) {
        return;
      }

      this.broadcastRange(surface, args.visibleRange);
    };

    registration.handler = handler;
    axis.visibleRangeChanged.subscribe(handler);
  }

  unregister(surface: SciChartSurface): void {
    const registration = this.surfaces.get(surface);
    if (!registration) {
      return;
    }

    const axis = surface.xAxes.get(0);
    if (axis && registration.handler) {
      axis.visibleRangeChanged.unsubscribe(registration.handler);
    }

    this.verticalGroup.removeSurface(surface);
    this.surfaces.delete(surface);

    if (!this.surfaces.size) {
      this.lastSyncedRange = undefined;
    }
  }

  private broadcastRange(source: SciChartSurface, range: NumberRange): void {
    this.lastSyncedRange = this.createRangeClone(range);

    this.suppressBroadcast = true; // Prevent re-entrant updates while we fan out changes.
    try {
      for (const [surface] of this.surfaces) {
        if (surface === source) {
          continue;
        }

        const axis = surface.xAxes.get(0);
        if (!axis) {
          continue;
        }

        axis.visibleRange = this.createRangeClone(range);
      }
    } finally {
      this.suppressBroadcast = false;
    }
  }

  private createRangeClone(range: NumberRange): NumberRange {
    return new NumberRange(range.min, range.max);
  }
}

export const chartSyncService = new ChartSyncService();
