import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

export interface HelloResponse {
  message: string;
}

export interface LocationResponse {
  city: string;
  region: string;
  country: string;
}

export interface TemperatureResponse {
  temperature: number;
  units: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  // Backend base URL (per requirements; no env wiring requested for this task)
  private readonly baseUrl = 'http://localhost:3001';

  private toUserFacingError(err: unknown, context: string): Error {
    if (err instanceof HttpErrorResponse) {
      const status = err.status ? ` (HTTP ${err.status})` : '';
      const backendMsg =
        typeof err.error === 'string'
          ? err.error
          : (err.error?.message as string | undefined) ||
            (err.message as string | undefined);

      return new Error(
        backendMsg
          ? `${context}${status}: ${backendMsg}`
          : `${context}${status}: Request failed.`
      );
    }

    return new Error(`${context}: Unexpected error.`);
  }

  getHello() {
    return this.http.get<HelloResponse>(`${this.baseUrl}/api/hello`).pipe(
      map((r) => r?.message ?? ''),
      catchError((e) => throwError(() => this.toUserFacingError(e, 'Hello')))
    );
  }

  getLocation() {
    return this.http.get<LocationResponse>(`${this.baseUrl}/api/location`).pipe(
      map((r) => {
        if (!r) return '';
        const parts = [r.city, r.region, r.country].filter(Boolean);
        return parts.join(', ');
      }),
      catchError((e) => throwError(() => this.toUserFacingError(e, 'Location')))
    );
  }

  getTemperature() {
    return this.http
      .get<TemperatureResponse>(`${this.baseUrl}/api/temperature`)
      .pipe(
        map((r) => {
          if (!r) return '';
          const units = r.units ?? '';
          return `${r.temperature}°${units}`;
        }),
        catchError((e) =>
          throwError(() => this.toUserFacingError(e, 'Temperature'))
        )
      );
  }
}
