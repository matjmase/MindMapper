import { MatIconButton } from '@angular/material/button';
import { OptionDto } from '../api';
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

  public static fromDto(dto: OptionDto): NetworkProgrammerCardOptionModel {
    const output = new NetworkProgrammerCardOptionModel();

    output.id = dto.id ?? '';
    output.Text = dto.text ?? '';
    output.connectButton = undefined;

    return output;
  }
}
