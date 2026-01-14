import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { DashboardApiService } from './services/dashboard-api.service';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface DataCardState {
  status: LoadStatus;
  value?: string;
  error?: string;
}

/**
 * Single-page dashboard UI that fetches hello message, location, and temperature
 * from the backend and displays them in a centered card layout.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly api = inject(DashboardApiService);

  pageLoading = false;

  hello: DataCardState = { status: 'idle' };
  location: DataCardState = { status: 'idle' };
  temperature: DataCardState = { status: 'idle' };

  ngOnInit(): void {
    this.refresh();
  }

  // PUBLIC_INTERFACE
  refresh(): void {
    /** Re-fetch all dashboard data from backend APIs. */
    this.pageLoading = true;

    // Set loading states
    this.hello = { status: 'loading' };
    this.location = { status: 'loading' };
    this.temperature = { status: 'loading' };

    this.api
      .getHello()
      .pipe(finalize(() => {}))
      .subscribe({
        next: (v) => (this.hello = { status: 'success', value: v }),
        error: (e: Error) =>
          (this.hello = { status: 'error', error: e.message }),
      });

    this.api.getLocation().subscribe({
      next: (v) => (this.location = { status: 'success', value: v }),
      error: (e: Error) =>
        (this.location = { status: 'error', error: e.message }),
    });

    this.api
      .getTemperature()
      .pipe(finalize(() => (this.pageLoading = false)))
      .subscribe({
        next: (v) => (this.temperature = { status: 'success', value: v }),
        error: (e: Error) => {
          this.temperature = { status: 'error', error: e.message };
          this.pageLoading = false;
        },
      });
  }

  // PUBLIC_INTERFACE
  hasAnyError(): boolean {
    /** Returns true if any of the three cards are in an error state. */
    return (
      this.hello.status === 'error' ||
      this.location.status === 'error' ||
      this.temperature.status === 'error'
    );
  }
}
