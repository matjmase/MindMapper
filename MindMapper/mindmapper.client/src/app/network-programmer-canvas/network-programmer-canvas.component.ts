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
    height: 1000,
    width: 1000,
    name: 'Unnamed',
    scale: 1,
  };

  public model: NetworkProgrammerCanvasModel =
    new NetworkProgrammerCanvasModel();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private canvasService: CanvasStateService,
    private cardService: CardService,
    private optionService: OptionService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('canvasStateId');

    if (id) {
      forkJoin([
        this.canvasService.apiCanvasStateIdGet(id),
        this.cardService.apiCardSearchGet(undefined, undefined, undefined, id),
      ])
        .pipe(
          mergeMap((canvasAndCards) => {
            return forkJoin(
              canvasAndCards[1].map((card) =>
                this.optionService
                  .apiOptionSearchGet(undefined, undefined, card.id!)
                  .pipe(
                    mergeMap<OptionDto[], Observable<[CardDto, OptionDto[]]>>(
                      (options) => {
                        return of([card, options]);
                      }
                    )
                  )
              )
            ).pipe(
              mergeMap<
                [CardDto, OptionDto[]][],
                Observable<[CanvasStateDto, [CardDto, OptionDto[]][]]>
              >((cardAndOptionArr) => {
                return of([canvasAndCards[0], cardAndOptionArr]);
              })
            );
          })
        )
        .subscribe((totalCanvas) => {
          const canvas = totalCanvas[0];
          const cardAndOptionsArr = totalCanvas[1];

          // update canvas
          this.canvas = canvas;

          // dto to internal
          const cards = cardAndOptionsArr.map((cardAndOptions) =>
            NetworkProgrammerCardModel.fromDto(cardAndOptions[0])
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

          cardAndOptionsArr.forEach((cardAndOptions) => {
            const options = cardAndOptions[1];

            // conversion to dto
            options.forEach((option) => {
              optionDtoMap.set(
                option,
                NetworkProgrammerCardOptionModel.fromDto(option)
              );
            });

            // connect option children to card
            const cardId = cardAndOptions[0].id!;
            cardIdMap.get(cardId)!.options = options.map(
              (option) => optionDtoMap.get(option)!
            );
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
        });
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
    // Canvas inital post
    let dbCanvas: CanvasStateDto;

    if (this.canvas.id) {
      dbCanvas = await firstValueFrom(
        this.canvasService.apiCanvasStatePut(this.canvas)
      );
    } else {
      dbCanvas = await firstValueFrom(
        this.canvasService.apiCanvasStatePost(this.canvas)
      );
    }

    const internalToDtoMap = new Map<NetworkProgrammerCardModel, CardDto>();

    // first card initial Post
    let firstCardDb: CardDto;

    if (this.model.rootCard.id) {
      firstCardDb = await firstValueFrom(
        this.cardService.apiCardPut(this.model.rootCard.toDto(dbCanvas.id!))
      );
    } else {
      firstCardDb = await firstValueFrom(
        this.cardService.apiCardPost(this.model.rootCard.toDto(dbCanvas.id!))
      );
    }

    internalToDtoMap.set(this.model.rootCard, firstCardDb);

    dbCanvas.seedCardId = firstCardDb.id;

    // canvas update
    dbCanvas = await firstValueFrom(
      this.canvasService.apiCanvasStatePut(dbCanvas)
    );

    // child cards initial post
    for (const child of this.model.childCards) {
      const childDto = child.toDto(dbCanvas.id!);

      let childDb: CardDto;
      if (childDto.id) {
        childDb = await firstValueFrom(this.cardService.apiCardPut(childDto));
      } else {
        childDb = await firstValueFrom(this.cardService.apiCardPost(childDto));
      }

      internalToDtoMap.set(child, childDb);
    }

    // options
    for (const option of this.model.rootCard.options) {
      const optionDto = option.toDto(
        internalToDtoMap.get(this.model.rootCard)?.id!
      );

      const pointsTo = this.model.optionConnections.get(option)?.[0];
      const mapedCard =
        pointsTo != undefined ? internalToDtoMap.get(pointsTo) : undefined;

      optionDto.pointToCardId = mapedCard?.id;

      if (optionDto.id) {
        await firstValueFrom(this.optionService.apiOptionPut(optionDto));
      } else {
        await firstValueFrom(this.optionService.apiOptionPost(optionDto));
      }
    }

    for (const child of this.model.childCards) {
      for (const option of child.options) {
        const optionDto = option.toDto(internalToDtoMap.get(child)?.id!);

        const pointsTo = this.model.optionConnections.get(option)?.[0];
        const mapedCard =
          pointsTo != undefined ? internalToDtoMap.get(pointsTo) : undefined;

        optionDto.pointToCardId = mapedCard?.id;

        if (optionDto.id) {
          await firstValueFrom(this.optionService.apiOptionPut(optionDto));
        } else {
          await firstValueFrom(this.optionService.apiOptionPost(optionDto));
        }
      }
    }

    // update cards
    const first = internalToDtoMap.get(this.model.rootCard)!;

    first.canvasStateId = dbCanvas.id;

    await firstValueFrom(this.cardService.apiCardPut(first));

    for (const child of this.model.childCards) {
      const dtoChild = internalToDtoMap.get(child)!;

      dtoChild.canvasStateId = dbCanvas.id;

      await firstValueFrom(this.cardService.apiCardPut(dtoChild));
    }

    this.router.navigate(['/programming']);
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
