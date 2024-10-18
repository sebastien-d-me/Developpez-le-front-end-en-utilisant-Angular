import { Component, OnInit } from '@angular/core';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTitleSubtitle,
    ApexStroke,
    ApexGrid
} from "ng-apexcharts";
import { OlympicService } from "src/app/core/services/olympic.service";
import { Observable, of } from "rxjs";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: any;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    public olympics$: Observable<any> = of(null)
    public chartOptions: Partial<any>;
    public datesXAxis: any;
    public dates: any;

    public chart: ApexChart = { type: "line" };
    
    constructor(private olympicService: OlympicService) {
        this.datesXAxis = [];
        this.dates = [];

        this.chartOptions = {
          series: [
            {
              name: "Desktops",
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }
          ],
          chart: {
            height: 350,
            type: "line",
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "straight"
          },
          title: {
            text: "Dates",
            align: "center"
          },
          grid: {
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.5
            }
          },
          tooltip: {
            enabled: false,
          },
        };
    }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.getDates();
    }

    getDates(): void {
        this.olympics$.subscribe((response) => {
            const testa = (response?.find((e: any) => e.id == 1));
            testa?.participations.map((date: any) => {
                this.datesXAxis.push(`"${date.year}"`);
                console.log(this.datesXAxis)
                this.dates = `categories: [
                    ${this.datesXAxis}
                ]`
                console.log(this.dates)
                return this.dates;
            });
        });

    }
}
