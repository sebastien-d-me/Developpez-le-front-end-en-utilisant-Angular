import { ChartResponsiveInterface, ChartOptionsInterface } from "src/app/core/models/Chart";
import { Component, OnInit } from "@angular/core";
import { ApexNonAxisChartSeries, ApexChart, ApexLegend, ApexTooltip } from "ng-apexcharts";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { Router } from "@angular/router";
import { OlympicInterface } from "src/app/core/models/Olympic";
import { ParticipationInterface } from "src/app/core/models/Participation";


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    legend: ApexLegend;
    responsive: ChartResponsiveInterface[];
    tooltip: ApexTooltip;
};

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    public chartOptions: Partial<ChartOptions>;
    public chart: ApexChart = {type: "pie"};
    public olympics$: Observable<OlympicInterface[]> = of([]);
    public numberJo: number = 0;
    public numberCountries: number = 0;

    constructor(private olympicService: OlympicService, private router: Router) {
        this.chartOptions = {
            chart: {
                events: {
                    click: (event: MouseEvent, chartContext: ApexChart, opts: ChartOptionsInterface) => {
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
        this.olympics$.subscribe((olympicData) => {
            this.getNumberJo(olympicData);
            this.getCountries(olympicData);
        });
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
