import { MatIconButton } from '@angular/material/button';
import { CardDto, NaiveCardDto } from '../api';
import { IConnectButtonContainer } from './connect-button-container';
import { NetworkProgrammerCanvasModel } from './network-programmer-canvas.model';
import { NetworkProgrammerCardOptionModel } from './network-programmer-card-option.model';

export class NetworkProgrammerCardModel implements IConnectButtonContainer {
  public id: string = '';

  public title: string = '';
  public description: string = '';

  public top: number = 0;
  public left: number = 0;

  public options: NetworkProgrammerCardOptionModel[] = [];

  public connectButton: MatIconButton | undefined;

  public toDto(canvasId: string): CardDto {
    return {
      id: this.id,
      canvasStateId: canvasId,
      title: this.title,
      description: this.description,
      top: this.top,
      left: this.left,
    };
  }

  public toNaiveDto(canvasId: string, indexId: number): NaiveCardDto {
    return {
      id: this.id,
      canvasStateId: canvasId,
      title: this.title,
      description: this.description,
      top: this.top,
      left: this.left,
      naiveId: indexId,
    };
  }

  public static fromDto(dto: CardDto): NetworkProgrammerCardModel {
    const output = new NetworkProgrammerCardModel();

    output.id = dto.id ?? '';
    output.title = dto.title ?? '';
    output.description = dto.description ?? '';
    output.top = dto.top ?? 0;
    output.left = dto.left ?? 0;
    output.options = [];
    output.connectButton = undefined;

    return output;
  }
}
