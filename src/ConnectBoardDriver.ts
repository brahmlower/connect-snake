export interface ConnectBoardRenderer {
  writeHoleValue: (value: HoleType, position: number) => void,
  flush: () => void,
}

export enum HoleType {
  Empty = 0,
  Yellow = 1,
  Red = 2,
}

export class ConnectBoardDriver {
  protected holes: HoleType[] = [];

  protected renderers: ConnectBoardRenderer[] = [];

  constructor(renderers?: ConnectBoardRenderer[]) {
    if (renderers !== undefined) {
      this.renderers = renderers;
    }
    this.clearHoles();
  }

  attachRenderer(renderer: ConnectBoardRenderer) {
    this.renderers.push(renderer);
  }

  getHole(x: number, y: number): HoleType | undefined {
    return this.holes[y * 7 + x];
  }

  setHole(x: number, y: number, holeType: HoleType) {
    this.holes[y * 7 + x] = holeType;
  }

  clearHoles() {
    this.holes = [];
    for (let i = 0; i < 42; i++) {
      this.holes.push(HoleType.Empty);
    }
  }

  flush() {
    this.holes.forEach((holeType: HoleType, index: number) => {
      this.renderers.forEach((renderer: ConnectBoardRenderer) => {
        renderer.writeHoleValue(holeType, index);
      });
    });
    this.renderers.forEach((renderer: ConnectBoardRenderer) => {
      renderer.flush();
    });
  }

  toString() {
    const rows: string[] = [];
    for (let r = 0; r < 6; r++) {
      const holes: string[] = [];
      for (let c = 0; c < 7; c++) {
        switch (this.holes[r * 7 + c]) {
          case HoleType.Empty:
            holes.push('e');
            break;
          case HoleType.Yellow:
            holes.push('y');
            break;
          case HoleType.Red:
            holes.push('r');
            break;
        }
      }
      rows.push(holes.join(' '));
    }
    return rows.join('\n');
  }
}
