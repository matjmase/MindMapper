import { PositionCoord } from './position-coord';

export interface DragPositionCoord extends PositionCoord {
  roundOffX: number;
  roundOffY: number;

  div: HTMLDivElement;
}
