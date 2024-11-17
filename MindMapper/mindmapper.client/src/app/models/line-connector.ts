import { PositionCoord } from './position-coord';

export class LineConnector {
  public Start: PositionCoord;
  public End: PositionCoord;

  constructor(start: PositionCoord, end: PositionCoord) {
    this.Start = start;
    this.End = end;
  }
}
