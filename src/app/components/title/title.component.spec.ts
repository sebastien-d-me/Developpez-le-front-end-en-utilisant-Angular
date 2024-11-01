import { TitleComponent } from "./title.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";


describe("TitleComponent", () => {
    let component: TitleComponent;
    let fixture: ComponentFixture<TitleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TitleComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
