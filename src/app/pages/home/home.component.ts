import { ChartResponsiveInterface, ChartOptionsInterface } from "src/app/core/models/Chart";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApexChart, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexTooltip } from "ng-apexcharts";
import { Observable, of, Subscription } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { Router } from "@angular/router";
import { OlympicInterface } from "src/app/core/models/Olympic";
import { ParticipationInterface } from "src/app/core/models/Participation";


export type ChartOptions = {
    chart: ApexChart;
    fill: ApexFill;
    labels: string[];
    legend: ApexLegend;
    responsive: ChartResponsiveInterface[];
    series: ApexNonAxisChartSeries;
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
    public subscription!: Subscription;
    public olympics$: Observable<OlympicInterface[]> = of([]);
    public numberJo: number = 0;
    public numberCountries: number = 0;
    
    constructor(private olympicService: OlympicService, private router: Router) {
        this.chartOptions = {
            chart: {
                events: {
                    click: (event: MouseEvent, chartContext: ApexChart, opts: ChartOptionsInterface) => {
                        if(opts.dataPointIndex !== -1) {
                            this.router.navigate(["/details", opts.dataPointIndex + 1]);
                        }
                    }
                },
                height: 600,
                type: "pie",
                width: 600
            },
            fill: {
                colors: ["#956065", "#793D52", "#89A1DB", "#9780A1", "#BFE0F1", "#B8CBE7"]
            },
            labels: [],
            legend: {
                customLegendItems: [],
                markers: {
                    fillColors:  ["#956065", "#793D52", "#89A1DB", "#9780A1", "#BFE0F1", "#B8CBE7"],
                },
                position: "bottom",
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
                    breakpoint: 900,
                    options: {
                        chart: {
                            height: 405,
                            width: 400
                        },
                    }
                },
                {
                    breakpoint: 400,
                    options: {
                        chart: {
                            height: 305,
                            width: 305
                        },
                    }
                },
            ],
            series: [],
            tooltip: {
                custom: function(opts: ChartOptionsInterface) {
                    return `
                    <div class="chart__tooltip">
                        <b>${opts.w.globals.labels[opts.seriesIndex]}</b>
                        <span>🎖️ ${opts.series[opts.seriesIndex]}</span>
                    </div>`;
                }
            }
        };
    }
    
    // Init the data
    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.subscription = this.olympics$.subscribe((olympicData) => {
            this.getNumberJo(olympicData);
            this.getCountries(olympicData);
        });
    }

    // Destroy the observable
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Get the number of JO's
    getNumberJo(olympicData: OlympicInterface[]): void {
        this.numberJo = olympicData?.reduce((countries: OlympicInterface, country: OlympicInterface) => {
            return (country.participations.length > countries.participations.length ? country : countries);
        })["participations"].length;
    }

    // Get the countries
    getCountries(olympicData: OlympicInterface[]): void {
        olympicData?.map((data: OlympicInterface) => {
            this.numberCountries++;
            this.chartOptions["labels"]?.push(data.country ?? "");
            this.chartOptions["legend"]?.customLegendItems?.push(data.country ?? "");
            this.getMedals(olympicData, data.country);
        });
    }

    // Get the medals per country
    getMedals(olympicData: OlympicInterface[], countryName: string): void {
        const country = (olympicData?.find((event: OlympicInterface) => event.country == countryName));
        const countryMedals = country?.participations.map((participation: ParticipationInterface) => {
            return participation.medalsCount;
        }).reduce((a: number, b: number) => a + b, 0);
        this.chartOptions["series"]?.push(countryMedals ?? 0);
    }
}
