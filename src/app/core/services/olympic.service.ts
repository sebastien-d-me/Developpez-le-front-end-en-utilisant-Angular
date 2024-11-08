import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { OlympicInterface } from "../models/Olympic";
import { HttpClient } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";


@Injectable({
    providedIn: "root",
})
export class OlympicService {
    private olympicUrl = "./assets/mock/olympic.json";
    private olympics$ = new BehaviorSubject<OlympicInterface[]>([]);

    constructor(private http: HttpClient) {}

    loadInitialData() {
        return this.http.get<OlympicInterface[]>(this.olympicUrl).pipe(
            tap((value) => this.olympics$.next(value)),
            catchError((error, caught) => {
                console.error(error);
                this.olympics$.next([]);
                return caught;
            })
        );
    }

    getOlympics() {
        return this.olympics$.asObservable();
    }
}
