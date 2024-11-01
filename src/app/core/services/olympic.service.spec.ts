import { OlympicService } from "./olympic.service";
import { TestBed } from "@angular/core/testing";


describe("OlympicService", () => {
    let service: OlympicService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OlympicService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
