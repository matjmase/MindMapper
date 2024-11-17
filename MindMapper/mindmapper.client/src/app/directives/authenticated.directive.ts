import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../services/session.service';

@Directive({
  selector: '[appAuthenticated]',
})
export class AuthenticatedDirective implements OnInit, OnDestroy {
  @Input() appAuthenticated = true;

  private sub: Subscription | undefined;

  private embedded: EmbeddedViewRef<unknown> | undefined;

  constructor(
    private sessionService: SessionService,
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}
  ngOnInit(): void {
    this.SetView();
    this.sub = this.sessionService.RolesHaveChanged.subscribe({
      next: () => this.SetView(),
    });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private SetView() {
    if (
      (this.sessionService.GetSavedResponse() !== undefined &&
        this.appAuthenticated) ||
      (this.sessionService.GetSavedResponse() === undefined &&
        !this.appAuthenticated)
    ) {
      if (!this.embedded) {
        this.embedded = this.vcr.createEmbeddedView(this.templateRef);
      }
    } else {
      if (this.embedded) {
        this.vcr.clear();
        this.embedded = undefined;
      }
    }
  }
}
