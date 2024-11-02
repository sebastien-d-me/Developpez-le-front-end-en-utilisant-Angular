import { Component, OnInit } from "@angular/core";
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexTooltip } from "ng-apexcharts";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { Router } from "@angular/router";


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: ApexDataLabels;
    legend: ApexLegend;
    tooltip: ApexTooltip;
};

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    public numberJo: number;


    public olympics$: Observable<any> = of(null);
    




    

    public chartOptions: Partial<any>;
    public chart: ApexChart = { type: "pie" };

    constructor(private olympicService: OlympicService, private router: Router) {
        this.numberJo = 0;

        this.chartOptions = {
            chart: {
                events: {
                    dataPointSelection: (event: any, chartContext: any, opts: any) => {
                        this.router.navigate(["/details", opts.dataPointIndex + 1]);
                    }
                },
                height: 600,
                type: "pie",
                width: 600
            },
            labels: [],
            legend: {
                position: "bottom"
            },
            responsive: [
                {
                    breakpoint: 1200,
                    options: {
                        chart: {
                            height: 500,
                            width: 500
                        },
                    }
                },
                {
                    breakpoint: 600,
                    options: {
                        chart: {
                            height: 300,
                            width: 300
                        },
                    }
                },
            ],
            series: [],
            tooltip: {
                custom: function(opts: any) {
                    return `
                    <div class="chart__tooltip">
                        <span>${opts.w.globals.labels[opts.seriesIndex]}</span>
                        <span>🎖️ ${opts.series[opts.seriesIndex]}</span>
                    </div>`;
                }
            }
        };
    }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.getNumberJo();
        this.getCountries();
    }

    // Get the number of JO's
    getNumberJo(): void {
        this.olympics$.subscribe((response) => {
            this.numberJo = response?.reduce((countries: any, country: any) => {
                return (country.participations.length > countries.participations.length ? country : countries);
            })["participations"].length;
        });
    }

    // Get the countries
    getCountries(): void {
        this.olympics$.subscribe((response) => {
            response?.map((data: any) => {
                this.chartOptions["labels"].push(data.country);
                this.getMedals(data.country);
            });
        });
    }

    // Get the medals per country
    getMedals(countryName: string): void {
        this.olympics$.subscribe((response) => {
            const country = (response?.find((e: any) => e.country == countryName));
            const countryMedals = country?.participations.map((participation: any) => {
                return participation.medalsCount;
            }).reduce((a: any, b: any) => a + b, 0);
            this.chartOptions['series'].push(countryMedals)
        });
    }
}
