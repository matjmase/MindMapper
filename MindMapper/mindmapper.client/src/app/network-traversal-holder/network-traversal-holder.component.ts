import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CanvasStateDto,
  CardDto,
  CompositeCanvasStateDtoResponse,
  CompositeCanvasStateService,
  OptionDto,
} from '../api';

interface CardOptionPair {
  card: CardDto;
  options: OptionDto[];
}

@Component({
  selector: 'app-network-traversal-holder',
  templateUrl: './network-traversal-holder.component.html',
  styleUrl: './network-traversal-holder.component.scss',
})
export class NetworkTraversalHolderComponent implements OnInit {
  public canvas: CanvasStateDto | undefined;
  public cards: CardDto[] | undefined;
  public options: OptionDto[] | undefined;

  private idToPairMap = new Map<string, CardOptionPair>();

  public selectedCardA: CardOptionPair | undefined;
  public selectedCardB: CardOptionPair | undefined;

  public cardASelected: boolean = true;
  public animating: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compositeService: CompositeCanvasStateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('canvasStateId');

    if (id) {
      this.compositeService
        .apiCompositeCanvasStateIdGet(id)
        .subscribe((composite) => this.initializeModel(composite));
    }
  }

  private initializeModel(composite: CompositeCanvasStateDtoResponse): void {
    this.canvas = composite.canvas;
    this.cards = composite.cards ?? undefined;
    this.options = composite.options ?? undefined;

    if (!this.canvas || !this.cards || !this.options) {
      return;
    }

    for (let card of this.cards) {
      this.idToPairMap.set(card.id!, {
        card: card,
        options: [],
      });
    }

    for (let option of this.options) {
      const pair = this.idToPairMap.get(option.cardId!);

      pair?.options.push(option);
    }

    const seedPair = this.idToPairMap.get(this.canvas.seedCardId!);

    this.setNewPair(seedPair);
  }

  public optionSelectedEvent(option: OptionDto): void {
    const newPair = this.idToPairMap.get(option.pointToCardId!);

    this.setNewPair(newPair);
  }

  public endTraversalEvent(): void {
    this.router.navigate(['/traversal']);
  }

  private setNewPair(pair: CardOptionPair | undefined): void {
    if (this.cardASelected) {
      this.selectedCardB = pair;
    } else {
      this.selectedCardA = pair;
    }

    console.log(this.selectedCardA);
    console.log(this.selectedCardB);

    this.cardASelected = !this.cardASelected;

    this.animating = true;

    setTimeout(() => {
      this.animating = false;
    }, 1000);
  }
}
