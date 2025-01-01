import {
  afterNextRender,
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  firstValueFrom,
  forkJoin,
  mergeAll,
  mergeMap,
  Observable,
  of,
  timeout,
  toArray,
} from 'rxjs';
import {
  CanvasStateDto,
  CanvasStateService,
  CardService,
  OptionService,
  CardDto,
  OptionDto,
  CompositeCanvasStateService,
  NaiveCardDto,
  NaiveOptionDto,
  CompositeCanvasStateDtoResponse,
} from '../api';
import { IConnectButtonContainer } from '../models/connect-button-container';
import { DragPositionCoord } from '../models/drag-position-coord';
import { LineConnector } from '../models/line-connector';
import { NetworkProgrammerCanvasModel } from '../models/network-programmer-canvas.model';
import { NetworkProgrammerCardOptionModel } from '../models/network-programmer-card-option.model';
import { NetworkProgrammerCardModel } from '../models/network-programmer-card.model';
import { PositionCoord } from '../models/position-coord';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-network-programmer-canvas',
  templateUrl: './network-programmer-canvas.component.html',
  styleUrl: './network-programmer-canvas.component.scss',
})
export class NetworkProgrammerCanvasComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  public canvas: CanvasStateDto = {
    id: '',
    height: 1000,
    width: 1000,
    name: 'Unnamed',
    scale: 1,
  };

  public model: NetworkProgrammerCanvasModel =
    new NetworkProgrammerCanvasModel();

  constructor(
    private route: ActivatedRoute,
    private compositeService: CompositeCanvasStateService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('canvasStateId');

    if (id) {
      this.compositeService
        .apiCompositeCanvasStateIdGet(id)
        .subscribe((composite) => this.initializeToComposite(composite));
    }
  }

  private initializeToComposite(composite: CompositeCanvasStateDtoResponse) {
    {
      if (composite == null) {
        return;
      }

      this.model = new NetworkProgrammerCanvasModel();

      // update canvas
      this.canvas = composite.canvas!;

      // dto to internal
      const cards = composite.cards!.map((card) =>
        NetworkProgrammerCardModel.fromDto(card)
      );

      // connecting map card id to internal
      const cardIdMap = new Map<string, NetworkProgrammerCardModel>();

      cards.forEach((card) => {
        cardIdMap.set(card.id, card);
      });

      // connecting map option dto to internal
      const optionDtoMap = new Map<
        OptionDto,
        NetworkProgrammerCardOptionModel
      >();

      composite.options!.forEach((option) => {
        optionDtoMap.set(
          option,
          NetworkProgrammerCardOptionModel.fromDto(option)
        );

        // connect option children to card
        const cardId = option.cardId!;
        cardIdMap.get(cardId)!.options.push(optionDtoMap.get(option)!);
      });

      // find seed card
      const seedCardIndex = cards.findIndex(
        (card) => card.id === this.canvas.seedCardId
      );

      const seedCard = cards[seedCardIndex];

      // remove from collection
      cards.splice(seedCardIndex, 1);

      // all but seed
      this.model.childCards = cards;

      // corner case - if it has loaded, this will already be loaded
      seedCard.connectButton = this.model.rootCard.connectButton;

      // assign the seed card
      this.model.rootCard = seedCard;

      // because we depend on "ngAfterViewInit" we have to wait for the views and ngFors to load.
      setTimeout(() => {
        // use the maps to connect them up
        optionDtoMap.forEach((internal, dto) => {
          if (dto.pointToCardId) {
            const match = cardIdMap.get(dto.pointToCardId);

            if (!match) {
              throw Error(
                'option points to card out of the context of this canvas'
              );
            }

            this.connectItem(internal);
            this.connectItem(match);
          }
        });
      }, 100);
    }
  }

  public addCard(): void {
    this.model.childCards.push(new NetworkProgrammerCardModel());
  }

  public adjustedPositionX(): number {
    return ((this.canvas.scale! - 1) * this.canvas.width!) / 2;
  }

  public adjustedPositionY(): number {
    return ((this.canvas.scale! - 1) * this.canvas.height!) / 2;
  }

  public connectItem(cardOrOption: IConnectButtonContainer): void {
    if (!this.model.proposedConnectionSource) {
      if (
        cardOrOption instanceof NetworkProgrammerCardModel ||
        cardOrOption instanceof NetworkProgrammerCardOptionModel
      ) {
        if (cardOrOption instanceof NetworkProgrammerCardOptionModel) {
          const option = cardOrOption as NetworkProgrammerCardOptionModel;

          this.clearOptionConnection(option);
        }
        this.model.proposedConnectionSource = cardOrOption;
      } else {
        throw new Error('Not Implemented connector type');
      }

      this.model.proposedConnection = this.makeConnector(cardOrOption);
    } else {
      if (cardOrOption instanceof NetworkProgrammerCardModel) {
        if (
          this.model.proposedConnectionSource instanceof
          NetworkProgrammerCardOptionModel
        ) {
          const card = cardOrOption as NetworkProgrammerCardModel;
          const option = this.model
            .proposedConnectionSource as NetworkProgrammerCardOptionModel;

          this.processOptionAndCard(card, option);
        } else {
          this.snackBar.open('Card can only be connected to an Option', 'ok', {
            duration: 3000,
          });
        }
      } else if (cardOrOption instanceof NetworkProgrammerCardOptionModel) {
        if (
          this.model.proposedConnectionSource instanceof
          NetworkProgrammerCardModel
        ) {
          const option = cardOrOption as NetworkProgrammerCardOptionModel;
          const card = this.model
            .proposedConnectionSource as NetworkProgrammerCardModel;

          this.clearOptionConnection(option);
          this.processOptionAndCard(card, option);
        } else {
          this.snackBar.open('Option can only be connected to a Card', 'ok', {
            duration: 3000,
          });
        }
      } else {
        throw new Error('Not Implemented connector type');
      }
    }
  }

  private makeConnector(container: IConnectButtonContainer): LineConnector {
    const posCoord = this.getCenterButtonPosition(container);

    return new LineConnector(
      {
        X: posCoord.X,
        Y: posCoord.Y,
      },
      {
        X: posCoord.X,
        Y: posCoord.Y,
      }
    );
  }

  private clearOptionConnection(option: NetworkProgrammerCardOptionModel) {
    this.model.deleteOption(option);
  }

  private processOptionAndCard(
    card: NetworkProgrammerCardModel,
    option: NetworkProgrammerCardOptionModel
  ) {
    const cardPos = this.getCenterButtonPosition(card);
    const optionPos = this.getCenterButtonPosition(option);

    const connector = new LineConnector(optionPos, cardPos);

    this.model.connections.add(connector);
    this.model.optionConnections.set(option, [card, connector]);
    if (!this.model.cardConnections.has(card)) {
      this.model.cardConnections.set(
        card,
        new Map<NetworkProgrammerCardOptionModel, LineConnector>()
      );
    }

    this.model.cardConnections.get(card)?.set(option, connector);

    this.model.proposedConnection = undefined;
    this.model.proposedConnectionSource = undefined;
  }

  private getCenterButtonPosition(
    container: IConnectButtonContainer
  ): PositionCoord {
    const bound = (<HTMLElement>(
      container.connectButton?._elementRef.nativeElement
    )).getBoundingClientRect();
    const origX = bound.left + bound.width / 2;
    const origY = bound.top + bound.height / 2;

    let parent = (<HTMLElement>(
      container.connectButton?._elementRef.nativeElement
    )).parentElement;

    while (parent && !parent.classList.contains('display-canvas')) {
      parent = parent.parentElement;
    }

    if (parent === null) {
      throw new Error('parent could not be found');
    }

    const boundParent = parent.getBoundingClientRect();
    const parentX = boundParent.x;
    const parentY = boundParent.y;

    const diffX = origX - parentX;
    const diffY = origY - parentY;

    const scaledX = diffX / this.canvas!.scale!;
    const scaledY = diffY / this.canvas!.scale!;

    return {
      X: scaledX,
      Y: scaledY,
    };
  }

  public async onSubmit(): Promise<void> {
    // canvas
    const canvas = this.canvas;

    // set IDs
    let counter = 0;
    const cardIndexMap = new Map<NetworkProgrammerCardModel, number>();
    const cards: NaiveCardDto[] = [];

    // populate and index
    cards.push(this.model.rootCard.toNaiveDto(canvas.id!, counter));
    cardIndexMap.set(this.model.rootCard, counter);
    counter++;
    for (let child of this.model.childCards) {
      cards.push(child.toNaiveDto(canvas.id!, counter));
      cardIndexMap.set(child, counter);
      counter++;
    }

    // options
    const options: NaiveOptionDto[] = [];

    // options
    for (const option of this.model.rootCard.options) {
      const pointsTo = this.model.optionConnections.get(option)?.[0];

      const optionDto = option.toNaiveDto(
        this.model.rootCard.id,
        cardIndexMap.get(this.model.rootCard)!,
        pointsTo ? cardIndexMap.get(pointsTo) : undefined
      );

      options.push(optionDto);
    }

    for (const child of this.model.childCards) {
      for (const option of child.options) {
        const pointsTo = this.model.optionConnections.get(option)?.[0];

        const optionDto = option.toNaiveDto(
          option.id,
          cardIndexMap.get(child)!,
          pointsTo ? cardIndexMap.get(pointsTo) : undefined
        );
        options.push(optionDto);
      }
    }

    // submit to API
    if (canvas.id) {
      this.compositeService
        .apiCompositeCanvasStatePut({
          canvas: canvas,
          cards: cards,
          options: options,
        })
        .subscribe((composite) => this.initializeToComposite(composite));
    } else {
      this.compositeService
        .apiCompositeCanvasStatePut({
          canvas: canvas,
          cards: cards,
          options: options,
        })
        .subscribe((composite) => this.initializeToComposite(composite));
    }
  }

  public canvasMouseMove(event: MouseEvent, div: HTMLDivElement) {
    if (this.model.proposedConnectionSource) {
      const bound = div.getBoundingClientRect();

      const offsetX = event.clientX - bound.x;
      const offsetY = event.clientY - bound.y;

      const scaledX = offsetX / this.canvas!.scale!;
      const scaledY = offsetY / this.canvas!.scale!;

      if (
        this.model.proposedConnectionSource instanceof
        NetworkProgrammerCardModel
      ) {
        this.model.proposedConnection!.Start = {
          X: scaledX,
          Y: scaledY,
        };
      } else if (
        this.model.proposedConnectionSource instanceof
        NetworkProgrammerCardOptionModel
      ) {
        this.model.proposedConnection!.End = {
          X: scaledX,
          Y: scaledY,
        };
      } else {
        throw Error('Not Implemented connector type');
      }
    }
  }

  public canvasMouseDown(event: MouseEvent) {
    if (event.buttons === 2) {
      this.model.proposedConnectionSource = undefined;
      this.model.proposedConnection = undefined;
    }
  }
}
