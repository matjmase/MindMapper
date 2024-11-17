export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './canvasState.service';
import { CanvasStateService } from './canvasState.service';
export * from './card.service';
import { CardService } from './card.service';
export * from './option.service';
import { OptionService } from './option.service';
export const APIS = [AuthenticationService, CanvasStateService, CardService, OptionService];
