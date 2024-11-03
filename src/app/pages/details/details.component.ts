import { ChartResponsiveInterface, ChartOptionsInterface } from "src/app/core/models/Chart";
import { Component, OnInit } from "@angular/core";
import { ApexChart, ApexDataLabels, ApexGrid, ApexAxisChartSeries, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from "ng-apexcharts";
import { Observable, of } from "rxjs";
import { OlympicService } from "src/app/core/services/olympic.service";
import { ActivatedRoute } from "@angular/router";
import { OlympicInterface } from "src/app/core/models/Olympic";


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
    public currentCountry: any;
    public totalMedals: number = 0;

    countryId: number = 0;
    maxMedals: number = 0;
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
                    data: []
                }
            ],
            stroke: {
                curve: "straight"
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

    // Init the data
    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();
        this.olympics$.subscribe((olympicData) => {
            this.route.params.subscribe(params => {
                this.countryId = params["id"];
                this.currentCountry = olympicData?.find((e: any) => e.id == this.countryId);
                this.getTitle(this.currentCountry);
                this.getDates(this.currentCountry);
                this.getMedals(this.currentCountry);
                this.getAthletes(this.currentCountry);
            });
        });
    }

    // Get the title of the country
    getTitle(currentCountry: any): void {
        this.countryName = currentCountry?.country ?? "";
    }

    // Get the dates
    getDates(currentCountry: any): void {
        currentCountry?.participations.map((participation: any) => {
            this.chartOptions["xaxis"]?.categories.push(participation.year ?? 0);
            console.log(this.chartOptions["xaxis"])
        });
    }

    getMedals(currentCountry: any): void {
        this.olympics$.subscribe((response) => {
            /*const testa = (response?.find((e: any) => e.id == this.countryId));
            this.nbParticipations = testa?.participations.length;
            testa?.participations.map((abcdef: any) => {
                
                this.chartOptions["series"][0].data.push(abcdef.medalsCount)
                this.totalMedals+= abcdef.medalsCount;
            });
            this.chartOptions["yaxis"].max = Math.max(...this.chartOptions["series"][0].data) + 10;*/
        });
    }

    // Get the total of athletes
    getAthletes(currentCountry: any): void {
        this.nbParticipations = currentCountry?.participations.length ?? 0;
        currentCountry?.participations.map((participation: any) => {
            this.totalAtlhetes += participation.athleteCount;
        });
    }
}
