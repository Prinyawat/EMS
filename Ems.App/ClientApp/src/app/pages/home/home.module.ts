import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { SignalRModule } from "../\u0E47\u0E35Hub/signalr.module";

@NgModule({
    imports: [
    CommonModule,
    HomeRoutingModule,
    SignalRModule
],
    declarations: [HomeComponent]
})
export class HomeModule { }
