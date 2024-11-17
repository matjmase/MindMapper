import { Component, Input } from '@angular/core';
import { LineConnector } from '../models/line-connector';

@Component({
  selector: 'app-network-programmer-canvas-arrow',
  templateUrl: './network-programmer-canvas-arrow.component.html',
  styleUrl: './network-programmer-canvas-arrow.component.scss',
})
export class NetworkProgrammerCanvasArrowComponent {
  @Input() public proposedConnection: LineConnector | undefined;
  @Input() public connections!: Set<LineConnector>;

  private buffer = 300;

  getLineString(connector: LineConnector) {
    return `M ${connector.Start.X} ${connector.Start.Y} C ${
      connector.Start.X + this.buffer
    } ${connector.Start.Y}, ${connector.End.X - this.buffer} ${
      connector.End.Y
    }, ${connector.End.X} ${connector.End.Y}`;
  }

  getArrowLines(connector: LineConnector) {
    return `M${connector.End.X - 20},${connector.End.Y + 0} L${
      connector.End.X - 20
    },${connector.End.Y - 20} L${connector.End.X + 0},${connector.End.Y + 0} L${
      connector.End.X - 20
    },${connector.End.Y + 20} L${connector.End.X - 20},${connector.End.Y + 0}`;
  }
}
