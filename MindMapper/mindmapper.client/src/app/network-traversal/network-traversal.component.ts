import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanvasStateDto, CanvasStateService } from '../api';

@Component({
  selector: 'app-network-traversal',
  templateUrl: './network-traversal.component.html',
  styleUrl: './network-traversal.component.scss',
})
export class NetworkTraversalComponent implements OnInit {
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
}
