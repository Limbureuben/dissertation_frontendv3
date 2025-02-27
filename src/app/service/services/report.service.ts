import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }

  private reportFormVisible = new BehaviorSubject<boolean>(false);
  reportFormVisible$ = this.reportFormVisible.asObservable();

  showReportForm(): void {
    this.reportFormVisible.next(true);
  }

  closeReportForm(): void {
    this.reportFormVisible.next(false);
  }
}
