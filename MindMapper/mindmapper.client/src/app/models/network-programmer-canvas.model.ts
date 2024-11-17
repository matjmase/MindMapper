import { LineConnector } from './line-connector';
import { NetworkProgrammerCardOptionModel } from './network-programmer-card-option.model';
import { NetworkProgrammerCardModel } from './network-programmer-card.model';

export class NetworkProgrammerCanvasModel {
  public proposedConnectionSource:
    | NetworkProgrammerCardModel
    | NetworkProgrammerCardOptionModel
    | undefined;

  public proposedConnection: LineConnector | undefined;

  public connections: Set<LineConnector> = new Set<LineConnector>();

  public cardConnections: Map<
    NetworkProgrammerCardModel,
    Map<NetworkProgrammerCardOptionModel, LineConnector>
  > = new Map<
    NetworkProgrammerCardModel,
    Map<NetworkProgrammerCardOptionModel, LineConnector>
  >();

  public optionConnections: Map<
    NetworkProgrammerCardOptionModel,
    [NetworkProgrammerCardModel, LineConnector]
  > = new Map<
    NetworkProgrammerCardOptionModel,
    [NetworkProgrammerCardModel, LineConnector]
  >();

  public rootCard = new NetworkProgrammerCardModel();
  public childCards: NetworkProgrammerCardModel[] = [];

  public deleteOption(option: NetworkProgrammerCardOptionModel) {
    if (this.optionConnections.has(option)) {
      const connAndCard = this.optionConnections.get(option);

      const conn = connAndCard?.[1]!;
      const card = connAndCard?.[0]!;

      this.connections.delete(conn);
      this.optionConnections.delete(option);
      this.cardConnections.get(card)?.delete(option);

      if (this.cardConnections.get(card)?.size === 0) {
        this.cardConnections.delete(card);
      }
    }
  }

  public deleteCard(card: NetworkProgrammerCardModel): void {
    for (let option of card.options) {
      this.deleteOption(option);
    }

    if (this.cardConnections.has(card)) {
      const children = this.cardConnections.get(card)!;

      for (let child of children) {
        this.connections.delete(child[1]);

        this.optionConnections.delete(child[0]);
      }

      this.cardConnections.delete(card);
    }
  }
}
