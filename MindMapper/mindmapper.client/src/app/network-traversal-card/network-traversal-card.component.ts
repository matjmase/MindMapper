import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardDto, OptionDto } from '../api';

@Component({
  selector: 'app-network-traversal-card',
  templateUrl: './network-traversal-card.component.html',
  styleUrl: './network-traversal-card.component.scss',
})
export class NetworkTraversalCardComponent {
  @Input() card!: CardDto;
  @Input() options!: OptionDto[];
  @Output() optionSelected = new EventEmitter<OptionDto>();
  @Output() endTraversal = new EventEmitter();

  public optionSelectedEmit(option: OptionDto) {
    if (option.pointToCardId) {
      this.optionSelected.emit(option);
    } else {
      this.endTraversalEmit();
    }
  }

  public endTraversalEmit(): void {
    this.endTraversal.emit();
  }
}
