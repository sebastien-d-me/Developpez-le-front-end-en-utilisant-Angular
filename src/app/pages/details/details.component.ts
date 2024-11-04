import { ChartResponsiveInterface, ChartOptionsInterface } from "src/app/core/models/Chart";
import { Component, OnInit } from "@angular/core";
import { ApexChart, ApexDataLabels, ApexGrid, ApexAxisChartSeries, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from "ng-apexcharts";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { ActivatedRoute } from "@angular/router";
import { OlympicInterface } from "src/app/core/models/Olympic";
import { ParticipationInterface } from "src/app/core/models/Participation";


export type ChartOptions = {
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    series: ApexAxisChartSeries;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
};

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
    public chartOptions: Partial<ChartOptions>;
    public chart: ApexChart = {type: "line"};
    public olympics$: Observable<OlympicInterface[]> = of([]);
    public currentCountry: OlympicInterface | null = null;
    public totalMedals: number = 0;

    countryId: number = 0;
    countryName: string = "";
    nbParticipations: number = 0;
    totalAtlhetes: number = 0;
    
    constructor(private olympicService: OlympicService, private route: ActivatedRoute) {
        this.chartOptions = {
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
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5
                }
            },
            series: [
                {
                    data: [],
                    name: "Medals"
                }
            ],
            stroke: {
                curve: "straight"
            },
            tooltip: {
                custom: function({dataPointIndex, w}) {
                    return `
                    <div class="chart__tooltip">
                        <b>${w.globals.seriesNames}</b>
                        <span>🎖️ ${w.globals.initialSeries[0].data[dataPointIndex]}</span>
                    </div>`;
                }
            },
            xaxis: {
                categories: []
            },
            yaxis: {
                min: 0,
                tickAmount: 5
            }
        };
    }

    // Init the data
    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.olympics$.subscribe((olympicData) => {
            this.route.params.subscribe(params => {
                this.countryId = params["id"];
                this.currentCountry = olympicData?.find((event: OlympicInterface) => event.id == this.countryId) || null;
                this.getTitle(this.currentCountry);
                this.loadData(this.currentCountry);
            });
        });
    }

    // Get the title of the country
    getTitle(currentCountry: OlympicInterface | null): void {
        this.countryName = currentCountry?.country ?? "";
    }

    // Load data
    loadData(currentCountry: OlympicInterface | null): void {
        this.nbParticipations = currentCountry?.participations.length ?? 0;
        currentCountry?.participations.map((participation: ParticipationInterface) => {
            // Get the dates
            this.chartOptions["xaxis"]?.categories.push(participation.year ?? 0);
            // Get the medals
            this.chartOptions["series"]![0].data.push(participation.medalsCount as any);
            this.totalMedals+= participation.medalsCount;
            // Get the total of athletes
            this.totalAtlhetes += participation.athleteCount;
        });
    }
}
