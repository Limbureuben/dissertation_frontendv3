import { Component } from '@angular/core';
import { ReportService } from './service/services/report.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test';

  isReportFormVisible = false;

  constructor(private reportService: ReportService) {
    this.reportService.reportFormVisible$.subscribe((visible) => {
      this.isReportFormVisible = visible;
    });
  }
}
