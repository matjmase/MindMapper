import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { IConnectButtonContainer } from '../models/connect-button-container';
import { NetworkProgrammerCardOptionModel } from '../models/network-programmer-card-option.model';
import { NetworkProgrammerCardModel } from '../models/network-programmer-card.model';

@Component({
  selector: 'app-network-programmer-card',
  templateUrl: './network-programmer-card.component.html',
  styleUrl: './network-programmer-card.component.scss',
})
export class NetworkProgrammerCardComponent implements AfterViewInit {
  @ViewChild('connectButton')
  public buttonTarget!: MatIconButton;

  @Input() public model!: NetworkProgrammerCardModel;
  @Input() public isClosable: boolean = true;

  @Output() public connectEvent = new EventEmitter<IConnectButtonContainer>();
  @Output() public closeEvent = new EventEmitter<NetworkProgrammerCardModel>();
  @Output() public closeOptionEvent =
    new EventEmitter<NetworkProgrammerCardOptionModel>();

  // mouse events
  @Output() public mouseUpEvent = new EventEmitter<void>();
  @Output() public mouseLeaveEvent = new EventEmitter<void>();
  @Output() public mouseMoveDragEvent = new EventEmitter<MouseEvent>();
  @Output() public mouseDownEvent = new EventEmitter<MouseEvent>();

  ngAfterViewInit(): void {
    this.model.connectButton = this.buttonTarget;
  }

  public addOption() {
    this.model.options.push(new NetworkProgrammerCardOptionModel());
  }

  public closeOption(option: NetworkProgrammerCardOptionModel): void {
    const index = this.model.options.indexOf(option);

    this.model.options.splice(index, 1);

    this.closeOptionEvent.emit(option);
  }

  public connectCard(): void {
    this.connectEvent.emit(this.model);
  }

  public connectOption(option: NetworkProgrammerCardOptionModel): void {
    this.connectEvent.emit(option);
  }

  public close(): void {
    this.closeEvent.emit(this.model);
  }

  // relay mouse actions
  public mouseUp(): void {
    this.mouseUpEvent.emit();
  }

  public mouseLeave(): void {
    this.mouseLeaveEvent.emit();
  }

  public mouseMoveDrag(event: MouseEvent): void {
    this.mouseMoveDragEvent.emit(event);
  }

  public mouseDown(event: MouseEvent): void {
    this.mouseDownEvent.emit(event);
  }
}
