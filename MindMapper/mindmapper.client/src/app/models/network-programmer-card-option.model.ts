import { MatIconButton } from '@angular/material/button';
import { NaiveOptionDto, OptionDto } from '../api';
import { NetworkProgrammerCanvasModel } from './network-programmer-canvas.model';
import { IConnectButtonContainer } from './connect-button-container';

export class NetworkProgrammerCardOptionModel
  implements IConnectButtonContainer
{
  public id: string = '';

  public Text: string = '';

  public connectButton: MatIconButton | undefined;

  public toDto(cardId: string): OptionDto {
    return {
      id: this.id,
      cardId: cardId,
      text: this.Text,
    };
  }

  public toNaiveDto(
    cardId: string,
    cardIndexId: number,
    pointsToIndexId: number | undefined
  ): NaiveOptionDto {
    return {
      id: this.id,
      cardId: cardId,
      text: this.Text,
      naiveCardId: cardIndexId,
      naivePointToCardId: pointsToIndexId ?? null,
    };
  }

  public static fromDto(dto: OptionDto): NetworkProgrammerCardOptionModel {
    const output = new NetworkProgrammerCardOptionModel();

    output.id = dto.id ?? '';
    output.Text = dto.text ?? '';
    output.connectButton = undefined;

    return output;
  }
}
