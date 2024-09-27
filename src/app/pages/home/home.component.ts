import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { ApexNonAxisChartSeries, ApexChart, ApexLegend } from "ng-apexcharts";
import { HttpClient } from "@angular/common/http";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: any;
    legend: ApexLegend;
};

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    public olympics$: Observable<any> = of(null);
    public chartOptions: Partial<any>;
    public chart: ApexChart = { type: "pie" };

    constructor(private http: HttpClient, private olympicService: OlympicService) {
        this.http.get("/assets/mock/olympic.json").subscribe(config => {
            console.log(config);
        });

        this.chartOptions = {
            series: [96, 54, 345, 125, 113],
            labels: ["Italy", "Spain", "United States", "Germany", "France"],
            chart: {
                height: 500,
                type: "pie",
                width: 500,
            },
            legend: {
                show: false,
            },
        };
    }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
    }
}
