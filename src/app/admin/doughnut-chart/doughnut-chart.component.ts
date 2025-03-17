import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnChanges, PLATFORM_ID, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-doughnut-chart',
  standalone: false,
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.scss'
})
export class DoughnutChartComponent implements AfterViewInit {
  @ViewChild('doughnutCanvas', { static: false }) doughnutCanvas!: ElementRef;
  chart!: Chart;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

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
          data: [45, 35, 20],
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
}
