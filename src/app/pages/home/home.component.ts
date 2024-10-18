import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { ApexNonAxisChartSeries, ApexChart, ApexLegend } from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: any;
    legend: ApexLegend;
    tooltip: any;
};

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    public olympics$: Observable<any> = of(null);
    public olympicCountries: any;
    public olympicsJo: number;
    public countriesMedal: any;
    public countriesMedals: any;

    public chartOptions: Partial<any>;
    public chart: ApexChart = { type: "pie" };

    constructor(private olympicService: OlympicService) {
        this.olympicCountries = [];
        this.countriesMedal = [];
        this.countriesMedals = [];

        this.chartOptions = {
            chart: {
                height: 600,
                type: "pie",
                width: 600,
                events: {
                    dataPointSelection: (event: any, chartContext: any, opts: any) => {
                        console.log(opts.w.config.labels[opts.dataPointIndex]);
                        console.log(opts.w.config.series[opts.dataPointIndex]);
                    }
                }
            },
            legend: {
                position: "bottom"
            },
            tooltip: {
                custom: function(opts: any) {
                    return `
                    <style>
                        .chart__tooltip {
                            background-color: #04838F;    
                            display: flex;
                            flex-direction: column;
                            gap: 2px 0;
                            min-width: 60px;
                            padding: 5px 10px;
                            text-align: center;
                        }
                    </style>

                    <div class="chart__tooltip">
                        <span>${opts.w.globals.labels[opts.seriesIndex]}</span>
                        <span>🎖️ ${opts.series[opts.seriesIndex]}</span>
                    </div>`;
                }
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
        this.getCountries();
        this.getNumberJo();
    }

    getCountries(): any {
        this.olympics$.subscribe((response) => {
            response?.map((name: any) => {
                this.olympicCountries.push(name.country);
                this.getMedals(name.country);
            });

            return this.olympicCountries;
        });
    }

    getNumberJo(): any {
        this.olympics$.subscribe((response) => {
            const numberJo = response?.reduce((countries: any, country: any) => {
                return (country.participations.length > countries.participations.length ? country : countries);
            });

            return this.olympicsJo = numberJo?.["participations"].length;
        });
    }

    getMedals(countryName: string): any {
        this.olympics$.subscribe((response) => {
            const testa = (response?.find((e: any) => e.country == countryName));
            testa?.participations.map((abcdef: any) => {
                this.countriesMedal.push(abcdef.medalsCount)
            });
        });
        const abc = this.countriesMedal.reduce((a: any, b: any) => a + b, 0);
        this.countriesMedals.push(abc);
        this.countriesMedal = [];
    }
}
