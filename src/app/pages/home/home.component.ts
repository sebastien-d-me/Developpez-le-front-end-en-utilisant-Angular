import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { ApexNonAxisChartSeries, ApexChart, ApexLegend } from "ng-apexcharts";

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
    public olympicsJo: number;

    public chartOptions: Partial<any>;
    public chart: ApexChart = { type: "pie" };

    constructor(private olympicService: OlympicService) {
        this.chartOptions = {
            series: [96, 54, 345, 125, 113],
            labels: ["Italy", "Spain", "United States", "Germany", "France"],
            chart: {
                height: 600,
                type: "pie",
                width: 600,
            },
            legend: {
                show: false,
            },
            responsive: [
                {
                    breakpoint: 1200,
                    options: {
                        chart: {
                            height: 500,
                            width: 500,
                        },
                    }
                },
                {
                    breakpoint: 600,
                    options: {
                        chart: {
                            height: 300,
                            width: 300,
                        },
                    }
                },
            ]
        };

        this.olympicsJo = 0;
    }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.olympicsJo = this.getNumberJo();
    }

    getNumberJo(): any {
        this.olympics$.subscribe((response) => {
            const numberJo = response?.reduce((countries: any, country: any) => {
                console.log(countries.participations);
                return (country.participations.length > countries.participations.length ? country : countries);
            });

            return this.olympicsJo = numberJo?.["participations"].length;
        });
    }
}
