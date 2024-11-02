import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApexNonAxisChartSeries, ApexChart, ApexLegend, ApexTooltip } from "ng-apexcharts";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { Router } from "@angular/router";
import { Olympic } from "src/app/core/models/Olympic";
import { Participation } from "src/app/core/models/Participation";


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: any;
    legend: ApexLegend;
    responsive: any;
    tooltip: ApexTooltip;
};

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
    public chartOptions: Partial<ChartOptions>;
    public chart: ApexChart = {type: "pie"};
    public olympics$: Observable<Olympic[]> = of([]);
    public olympicSubscribe: any;
    public numberJo: number = 0;

    constructor(private olympicService: OlympicService, private router: Router) {
        this.chartOptions = {
            chart: {
                events: {
                    click: (event: any, chartContext: any, opts: any) => {
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

    // Init the data
    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.olympicSubscribe = this.olympics$.subscribe((olympicData) => {
            this.getNumberJo(olympicData);
            this.getCountries(olympicData);
        });
    }

    // Destroy the subscriber
    ngOnDestroy(): void {
        this.olympicSubscribe.unsubscribe();
    }

    // Get the number of JO's
    getNumberJo(olympicData: Olympic[]): void {
        this.numberJo = olympicData?.reduce((countries: Olympic, country: Olympic) => {
            return (country.participations.length > countries.participations.length ? country : countries);
        })["participations"].length;
    }

    // Get the countries
    getCountries(olympicData: Olympic[]): void {
        olympicData?.map((data: Olympic) => {
            this.chartOptions["labels"].push(data.country);
            this.getMedals(olympicData, data.country);
        });
    }

    // Get the medals per country
    getMedals(olympicData: Olympic[], countryName: string): void {
        const country = (olympicData?.find((event: Olympic) => event.country == countryName));
        const countryMedals = country?.participations.map((participation: Participation) => {
            return participation.medalsCount;
        }).reduce((a: number, b: number) => a + b, 0);
        this.chartOptions["series"]?.push(countryMedals ?? 0);
    }
}
