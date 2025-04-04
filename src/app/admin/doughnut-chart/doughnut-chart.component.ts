import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { OpenspaceService } from '../../service/openspace.service';

@Component({
  selector: 'app-doughnut-chart',
  standalone: false,
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements AfterViewInit, OnInit {
  @ViewChild('doughnutCanvas', { static: false }) doughnutCanvas!: ElementRef;
  totalOpenSpaces: number = 0;
  chart!: Chart;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private openspaceservice: OpenspaceService
  ) {}

  ngOnInit(): void {
    this.openspaceservice.getOpenspaceCount().subscribe({
      next: (result) => {
        if (result.data && result.data.totalOpenspaces !== undefined) {
          this.totalOpenSpaces = result.data.totalOpenspaces;
          this.updateDoughnutChart();
        } else {
          console.error("totalOpenspaces not found in API response.");
        }
      },
      error: (err) => {
        console.error("Failed to fetch open space count:", err);
      }
    });
  }


  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.createDoughnutChart();
      }, 500);
    }
  }

  createDoughnutChart() {
    if (!this.doughnutCanvas || !this.doughnutCanvas.nativeElement) {
      console.error("Canvas element not found!");
      return;
    }

    const ctx = this.doughnutCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context from canvas.");
      return;
    }

    // Destroy previous chart instance if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Open Spaces", "Developed Areas", "Protected Lands"],
        datasets: [{
          data: [this.totalOpenSpaces, 35, 20],
          backgroundColor: ["#4CAF50", "#FF9800", "#3f51b5"],
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom"
          }
        },
        cutout: "60%" // Controls the hole size in the doughnut
      }
    });
  }

  updateDoughnutChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data[0] = this.totalOpenSpaces;
      this.chart.update();
    }
  }
}
