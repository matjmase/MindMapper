import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NetworkProgrammerCardModel } from '../models/network-programmer-card.model';
import { DragPositionCoord } from '../models/drag-position-coord';
import { CanvasStateDto } from '../api';
import { NetworkProgrammerCanvasModel } from '../models/network-programmer-canvas.model';
import { NetworkProgrammerCardOptionModel } from '../models/network-programmer-card-option.model';
import { IConnectButtonContainer } from '../models/connect-button-container';
import { LineConnector } from '../models/line-connector';
import { PositionCoord } from '../models/position-coord';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-network-programmer-canvas-draggable',
  templateUrl: './network-programmer-canvas-draggable.component.html',
  styleUrl: './network-programmer-canvas-draggable.component.scss',
})
export class NetworkProgrammerCanvasDraggableComponent {
  @Input() public canvas!: CanvasStateDto;
  @Input() public model!: NetworkProgrammerCanvasModel;

  @Output() public onConnect = new EventEmitter<IConnectButtonContainer>();

  public dragPosition: DragPositionCoord | undefined;

  public closeOption(option: NetworkProgrammerCardOptionModel) {
    this.model.deleteOption(option);
  }

  public closeCard(card: NetworkProgrammerCardModel) {
    const cardIndex = this.model.childCards.indexOf(card);

    this.model.childCards.splice(cardIndex, 1);

    this.model.deleteCard(card);
  }

  public mouseUp(): void {
    this.dragPosition = undefined;
  }

  public mouseLeave(): void {
    this.dragPosition = undefined;
  }

  public mouseMoveDrag(
    event: MouseEvent,
    div: HTMLDivElement,
    model: NetworkProgrammerCardModel
  ): void {
    if (this.dragPosition && this.dragPosition.div === div) {
      div.style.position = 'absolute';

      const offsetX = this.getOffsetPositionX(event, div);
      const offsetY = this.getOffsetPositionY(event, div);

      const diffX = offsetX - this.dragPosition.X + this.dragPosition.roundOffX;
      const diffY = offsetY - this.dragPosition.Y + this.dragPosition.roundOffY;

      this.dragPosition.X = offsetX;
      this.dragPosition.Y = offsetY;

      const intDiffX = Math.round(diffX);
      const intDiffY = Math.round(diffY);

      this.dragPosition.roundOffX = diffX - intDiffX;
      this.dragPosition.roundOffY = diffY - intDiffY;

      model.left = model.left + intDiffX;
      model.top = model.top + intDiffY;

      if (this.model.proposedConnectionSource === model) {
        this.model.proposedConnection!.End = {
          X: this.model.proposedConnection!.End.X + intDiffX,
          Y: this.model.proposedConnection!.End.Y + intDiffY,
        };
      } else if (
        model.options.some(
          (option) => option === this.model.proposedConnectionSource
        )
      ) {
        this.model.proposedConnection!.Start = {
          X: this.model.proposedConnection!.Start.X + intDiffX,
          Y: this.model.proposedConnection!.Start.Y + intDiffY,
        };
      } else if (this.model.cardConnections.has(model)) {
        const entries = this.model.cardConnections.get(model)!.entries();

        for (const [key, value] of entries) {
          value.End = {
            X: value.End.X + intDiffX,
            Y: value.End.Y + intDiffY,
          };
        }
      }

      for (const option of model.options) {
        if (this.model.optionConnections.has(option)) {
          const connect = this.model.optionConnections.get(option)?.[1]!;

          connect.Start = {
            X: connect.Start.X + intDiffX,
            Y: connect.Start.Y + intDiffY,
          };
        }
      }
    } else {
      this.dragPosition = undefined;
    }
  }

  public mouseDown(event: MouseEvent, div: HTMLDivElement): void {
    if (event.buttons === 1) {
      const offsetX = this.getOffsetPositionX(event, div);
      const offsetY = this.getOffsetPositionY(event, div);

      this.dragPosition = {
        X: offsetX,
        Y: offsetY,

        roundOffX: 0,
        roundOffY: 0,

        div: div,
      };
    }
  }

  public connectItem(model: IConnectButtonContainer): void {
    this.onConnect.emit(model);
  }

  private getOffsetPositionX(event: MouseEvent, div: HTMLDivElement): number {
    const bounding = div.parentElement!.getBoundingClientRect();

    const offsetX = event.pageX - bounding.left;

    return offsetX / this.canvas!.scale!;
  }

  private getOffsetPositionY(event: MouseEvent, div: HTMLDivElement): number {
    const bounding = div.parentElement!.getBoundingClientRect();

    const offsetY = event.pageY - bounding.top;

    return offsetY / this.canvas!.scale!;
  }
}
