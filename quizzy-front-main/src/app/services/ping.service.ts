import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

export enum PingStatus {
  KO = 'KO',
  Partial = 'Partial',
  Full = 'Full',
}

interface PingResponse {
  status: "OK" | "Partial" | "KO";
  details: {
    database: "OK" | "KO";
  };
}

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private readonly httpClient = inject(HttpClient);

  ping(): Observable<PingStatus> {
    return this.httpClient.get<PingResponse>(`${environment.apiUrl}/ping`).pipe(
      map((response: any) => {
        if (response.status === "KO") {
          return PingStatus.KO;
        }
        if (response.status === "Partial" || response.status === "OK" && (!response.details || response.details?.database === "KO")) {
          return PingStatus.Partial;
        }
        return PingStatus.Full;
      }
    ), catchError(() => of(PingStatus.KO)));
  }
}
