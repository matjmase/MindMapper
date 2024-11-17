import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { CanvasStateDto, CanvasStateService } from '../api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-network-programmer',
  templateUrl: './network-programmer.component.html',
  styleUrl: './network-programmer.component.scss',
})
export class NetworkProgrammerComponent implements OnInit {
  private snackbar = inject(MatSnackBar);

  public canvases: CanvasStateDto[] = [];

  constructor(private canvasService: CanvasStateService) {}

  ngOnInit(): void {
    this.loadCanvases();
  }

  loadCanvases(): void {
    this.canvasService
      .apiCanvasStateGet()
      .subscribe((canvases) => (this.canvases = canvases));
  }

  deleteCanvas(canvas: CanvasStateDto): void {
    this.canvasService.apiCanvasStateDelete(canvas).subscribe({
      complete: () => {
        this.loadCanvases();
        this.snackbar.open('Canvas successfully deleted', 'ok', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackbar.open('Canvas had an error with deletion', 'ok', {
          duration: 3000,
        });
      },
    });
  }
}
