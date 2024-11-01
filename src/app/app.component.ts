import { Component, OnInit } from "@angular/core";
import { OlympicService } from "./core/services/olympic.service";
import { take } from "rxjs";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    constructor(private olympicService: OlympicService) {}

    ngOnInit(): void {
        this.olympicService.loadInitialData().pipe(take(1)).subscribe();
    }
}