import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CanvasStateDto } from '../api';

@Component({
  selector: 'app-network-programmer-canvas-toolbar[canvas]',
  templateUrl: './network-programmer-canvas-toolbar.component.html',
  styleUrl: './network-programmer-canvas-toolbar.component.scss',
})
export class NetworkProgrammerCanvasToolbarComponent {
  public zoomNumber: number = 0.2;
  public sizeDiff: number = 200;

  @Output() submitEvent = new EventEmitter<void>();

  @Output() addCardEvent = new EventEmitter<void>();

  @Input() canvas!: CanvasStateDto;

  public onSubmit() {
    this.submitEvent.emit();
  }

  public addCard() {
    this.addCardEvent.emit();
  }

  public zoomIn(): void {
    this.canvas.scale! *= 1 + this.zoomNumber;
  }

  public zoomOut(): void {
    this.canvas.scale! *= 1 - this.zoomNumber;
  }

  public enlargeX(): void {
    this.canvas!.width! += this.sizeDiff;
  }

  public shrinkX(): void {
    this.canvas.width! -= this.sizeDiff;

    this.canvas.width! =
      this.canvas!.width! < this.sizeDiff ? this.sizeDiff : this.canvas!.width!;
  }

  public enlargeY(): void {
    this.canvas!.height! += this.sizeDiff;
  }

  public shrinkY(): void {
    this.canvas.height! -= this.sizeDiff;

    this.canvas.height! =
      this.canvas!.height! < this.sizeDiff
        ? this.sizeDiff
        : this.canvas!.height!;
  }
}
