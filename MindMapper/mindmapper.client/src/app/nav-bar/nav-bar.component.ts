import { Component } from '@angular/core';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  constructor(private sessionService: SessionService) {}

  public logout(): void {
    this.sessionService.RemoveSession();
  }
}
