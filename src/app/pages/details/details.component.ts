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
import { ActivatedRoute } from '@angular/router';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: any;
    yaxis: any;
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

    public chart: ApexChart = { type: "line" };

    public totalMedals:  number;

    countryId: number;
    maxMedals: number;
    countryName: string;
    nbParticipations: number;
    totalAtlhetes: number;
    
    constructor(private olympicService: OlympicService, private route: ActivatedRoute) {
        this.countryId = 0;
        this.maxMedals = 0;
        this.totalMedals = 0;
        this.nbParticipations = 0;
        this.countryName = "";
        this.totalAtlhetes = 0;

        this.chartOptions = {
          series: [
            {
              data: []
            }
          ],
          chart: {
            height: 350,
            toolbar: {
                show: false
            },
            type: "line",
            zoom: {
              enabled: false
            }
          },
          stroke: {
            curve: "straight"
          },
          grid: {
            row: {
              colors: ["#f3f3f3", "transparent"],
              opacity: 0.5
            }
          },
          tooltip: {
            enabled: false,
          },
          xaxis: {
            categories: []
          },
          yaxis: {
            min: 0,
            tickAmount: 5,
          }
        };
    }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.route.params.subscribe(params => {
            this.countryId = params['id'];
            this.getTitle();
            this.getDates();
            this.getMedals();
            this.getAthletes();
        });
    }

    getTitle(): any {
        this.olympics$.subscribe((response) => {
            const ttest = (response?.find((e: any) => e.id == this.countryId));
            this.countryName = ttest?.country;
        });
    }

    getDates(): any {
        this.olympics$.subscribe((response) => {
            const testa = (response?.find((e: any) => e.id == this.countryId));
            testa?.participations.map((date: any) => {
                this.chartOptions['xaxis'].categories.push(date.year);
            });
        });
    }

    getMedals(): any {
        this.olympics$.subscribe((response) => {
            const testa = (response?.find((e: any) => e.id == this.countryId));
            this.nbParticipations = testa?.participations.length;
            testa?.participations.map((abcdef: any) => {
                
                this.chartOptions['series'][0].data.push(abcdef.medalsCount)
                this.totalMedals+= abcdef.medalsCount;
            });
            this.chartOptions['yaxis'].max = Math.max(...this.chartOptions['series'][0].data) + 10;
        });
    }

    getAthletes(): any {
        this.olympics$.subscribe((response) => {
            const testa = (response?.find((e: any) => e.id == this.countryId));
            this.nbParticipations = testa?.participations.length;
            testa?.participations.map((abcdef: any) => {
                this.totalAtlhetes += abcdef.athleteCount
            });
        });
    }
}
