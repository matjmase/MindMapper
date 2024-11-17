import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionModelDto } from '../api';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public RolesHaveChanged = new Subject<void>();

  constructor() {}

  public SaveResponse(response: SessionModelDto) {
    localStorage.setItem('Authentication', JSON.stringify(response));
    this.RolesHaveChanged.next();
  }

  public RemoveSession() {
    localStorage.clear();
    this.RolesHaveChanged.next();
  }

  public GetSavedResponse(): SessionModelDto | undefined {
    const strResp = localStorage.getItem('Authentication');

    if (!strResp) {
      return undefined;
    } else {
      const response = <SessionModelDto>JSON.parse(strResp);
      return response;
    }
  }
}
