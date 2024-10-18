import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './pages/details/details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { TitleComponent } from './components/title/title.component';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from "./components/button/button.component";

@NgModule({
  declarations: [AppComponent, HomeComponent, DetailsComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, NgApexchartsModule, TitleComponent, CardComponent, ButtonComponent],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
