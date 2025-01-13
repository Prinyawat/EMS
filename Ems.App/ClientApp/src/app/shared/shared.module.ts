import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CustomInterceptor } from "./services/custom.interceptor";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule],
    exports: [
        RouterModule,
        CommonModule,
        FormsModule],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
    ]
})
export class SharedModule { }
