import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { NetworkProgrammerCardOptionModel } from '../models/network-programmer-card-option.model';

@Component({
  selector: 'app-network-programmer-option',
  templateUrl: './network-programmer-option.component.html',
  styleUrl: './network-programmer-option.component.scss',
})
export class NetworkProgrammerOptionComponent implements AfterViewInit {
  @ViewChild('connectButton')
  public buttonTarget!: MatIconButton;

  @Input()
  public model!: NetworkProgrammerCardOptionModel;

  @Output() closeEvent = new EventEmitter<NetworkProgrammerCardOptionModel>();
  @Output() connectEvent = new EventEmitter<NetworkProgrammerCardOptionModel>();

  ngAfterViewInit(): void {
    this.model.connectButton = this.buttonTarget;
  }

  public close(): void {
    this.closeEvent.emit(this.model);
  }

  public connect(): void {
    this.connectEvent.emit(this.model);
  }
}
