import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartComponent, ApexResponsive, ApexChart } from 'ng-apexcharts';

export type ChartOptions = {
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    public olympics$: Observable<any> = of(null);
    public chartOptions: Partial<any>;
    public chart: ApexChart = { type: 'bar' };

    constructor(private olympicService: OlympicService) {
        this.chartOptions = {
            series: [96, 54, 345, 125, 113],
            labels: ["Italy", "Spain", "United States", "Germany", "France"],
            chart: {
                width: 400,
                type: "pie",
            }
        };
    }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
    }
}
